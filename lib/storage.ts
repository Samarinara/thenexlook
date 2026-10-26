import { getStore } from "@netlify/blobs"
import { mkdir, readFile, readdir, unlink, writeFile } from "node:fs/promises"
import { join } from "node:path"
import type { Look } from "@/lib/types"

// Netlify injects its Blobs context in Netlify Dev and deployed functions.
// Plain Next.js development uses files so it needs no Netlify credentials.
const useLocalStorage =
  process.env.STORAGE_BACKEND === "local" ||
  (process.env.NODE_ENV === "development" &&
    !process.env.NETLIFY &&
    !process.env.NETLIFY_BLOBS_CONTEXT &&
    !process.env.NETLIFY_SITE_ID)

const localRoot = join(process.cwd(), "data", "local")

function localPath(kind: "looks" | "images", key: string, extension: string) {
  if (!/^[a-zA-Z0-9-]+$/.test(key)) throw new Error("Invalid storage key")
  return join(localRoot, kind, `${key}.${extension}`)
}

// Deploy previews use a separate namespace configured in netlify.toml.
function portfolioStore(name: "looks" | "images") {
  const prefix = process.env.BLOB_STORE_PREFIX || "thenexlook"
  return getStore({ name: `${prefix}-${name}`, consistency: "strong" })
}

export async function listLookKeys(): Promise<string[]> {
  if (useLocalStorage) {
    try {
      return (await readdir(join(localRoot, "looks")))
        .filter((name) => name.endsWith(".json"))
        .map((name) => name.slice(0, -5))
    } catch (error) {
      if (isMissing(error)) return []
      throw error
    }
  }
  const keys: string[] = []
  for await (const page of portfolioStore("looks").list({ paginate: true })) {
    keys.push(...page.blobs.map(({ key }) => key))
  }
  return keys
}

export async function getStoredLook(key: string): Promise<Look | null> {
  if (!useLocalStorage) return portfolioStore("looks").get(key, { type: "json" })
  try {
    return JSON.parse(await readFile(localPath("looks", key, "json"), "utf8")) as Look
  } catch (error) {
    if (isMissing(error)) return null
    throw error
  }
}

export async function setStoredLook(key: string, look: Look): Promise<void> {
  if (!useLocalStorage) {
    await portfolioStore("looks").setJSON(key, look)
    return
  }
  await mkdir(join(localRoot, "looks"), { recursive: true })
  await writeFile(localPath("looks", key, "json"), JSON.stringify(look))
}

export async function deleteStoredLook(key: string): Promise<void> {
  if (!useLocalStorage) {
    await portfolioStore("looks").delete(key)
    return
  }
  await unlink(localPath("looks", key, "json"))
}

export async function putImage(
  key: string,
  bytes: ArrayBuffer,
  contentType: string
): Promise<void> {
  if (!useLocalStorage) {
    await portfolioStore("images").set(key, bytes, {
      metadata: { contentType },
    })
    return
  }
  await mkdir(join(localRoot, "images"), { recursive: true })
  await writeFile(localPath("images", key, "bin"), Buffer.from(bytes))
  await writeFile(
    localPath("images", key, "json"),
    JSON.stringify({ contentType })
  )
}

export async function getImage(
  key: string
): Promise<{ data: ArrayBuffer; metadata: { contentType: string } } | null> {
  if (!useLocalStorage)
    return portfolioStore("images").getWithMetadata(key, { type: "arrayBuffer" }) as Promise<{
      data: ArrayBuffer
      metadata: { contentType: string }
    } | null>
  try {
    const [bytes, metadata] = await Promise.all([
      readFile(localPath("images", key, "bin")),
      readFile(localPath("images", key, "json"), "utf8"),
    ])
    return {
      data: Uint8Array.from(bytes).buffer,
      metadata: JSON.parse(metadata) as { contentType: string },
    }
  } catch (error) {
    if (isMissing(error)) return null
    throw error
  }
}

function isMissing(error: unknown): boolean {
  return (error as NodeJS.ErrnoException).code === "ENOENT"
}
