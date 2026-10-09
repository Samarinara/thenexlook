import { readFile } from "node:fs/promises"
import { createHash } from "node:crypto"
import { getStore } from "@netlify/blobs"

// Run locally with server-side credentials, never from a public API endpoint.
const { NETLIFY_SITE_ID: siteID, NETLIFY_AUTH_TOKEN: token } = process.env
if (!siteID || !token)
  throw new Error(
    "Set NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN locally before importing"
  )
const prefix = process.env.BLOB_STORE_PREFIX || "thenexlook"
const options = { siteID, token, consistency: "strong" }
const looksStore = getStore({ ...options, name: `${prefix}-looks` })
const imagesStore = getStore({ ...options, name: `${prefix}-images` })
const looks = JSON.parse(
  await readFile(process.argv[2] || "data/looks.json", "utf8")
)
if (!Array.isArray(looks))
  throw new Error(
    "Expected a JSON array of looks exported from the old /api/looks endpoint"
  )
for (const look of looks) {
  if (
    !look.id ||
    !look.title ||
    !Array.isArray(look.images) ||
    !look.images.length ||
    !look.createdAt
  ) {
    throw new Error("Invalid look in import file")
  }
  if (await looksStore.get(look.id)) {
    console.log(`Skipped existing look: ${look.title}`)
    continue
  }
  const images = []
  for (const source of look.images) {
    const url = new URL(source)
    if (url.protocol !== "https:")
      throw new Error("Import image URLs must use HTTPS")
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
    if (!response.ok)
      throw new Error(
        `Could not download an image for ${look.title}: HTTP ${response.status}`
      )
    const contentType = response.headers.get("content-type")?.split(";")[0]
    if (
      !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(
        contentType
      )
    ) {
      throw new Error(
        `Unsupported image type for ${look.title}; convert the image before importing`
      )
    }
    const bytes = await response.arrayBuffer()
    if (!bytes.byteLength || bytes.byteLength > 4 * 1024 * 1024) {
      throw new Error(
        `Image for ${look.title} must be nonempty and at most 4 MB; resize before importing`
      )
    }
    // Stable keys make a partially completed import safe to retry.
    const hash = createHash("sha256").update(source).digest("hex")
    const key = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`
    await imagesStore.set(key, bytes, {
      metadata: { contentType },
      onlyIfNew: true,
    })
    images.push(`/api/images/${key}`)
  }
  const coverIndex =
    Number.isInteger(look.coverIndex) &&
    look.coverIndex >= 0 &&
    look.coverIndex < images.length
      ? look.coverIndex
      : 0
  await looksStore.setJSON(
    look.id,
    {
      id: look.id,
      title: look.title,
      description: look.description || "",
      images,
      coverIndex,
      createdAt: look.createdAt,
    },
    { onlyIfNew: true }
  )
  console.log(`Imported look: ${look.title}`)
}
console.log(
  "Import complete. Check every look on the new site before retiring the old services."
)
