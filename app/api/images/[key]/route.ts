import { portfolioStore } from "@/lib/storage"
import { IMAGE_TYPES } from "@/lib/images"

export const runtime = "nodejs"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params
  if (!/^[a-f0-9-]{36}$/.test(key))
    return new Response("Not found", { status: 404 })
  const result = await portfolioStore("images").getWithMetadata(key, {
    type: "arrayBuffer",
  })
  if (!result) return new Response("Not found", { status: 404 })
  const contentType = String(result.metadata.contentType)
  if (!IMAGE_TYPES.includes(contentType))
    return new Response("Not found", { status: 404 })
  return new Response(result.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  })
}
