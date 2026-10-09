import { getStore } from "@netlify/blobs"

// Deploy previews use a separate namespace configured in netlify.toml.
export function portfolioStore(name: "looks" | "images") {
  const prefix = process.env.BLOB_STORE_PREFIX || "thenexlook"
  return getStore({ name: `${prefix}-${name}`, consistency: "strong" })
}
