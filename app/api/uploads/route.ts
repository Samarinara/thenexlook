import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"
import { portfolioStore } from "@/lib/storage"
import { detectImageType, MAX_IMAGE_BYTES } from "@/lib/images"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const session = (await cookies()).get("session")
  if (!session || !verifySessionToken(session.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (Number(req.headers.get("content-length")) > MAX_IMAGE_BYTES + 65536) {
    return Response.json(
      { error: "Images must be 4 MB or smaller" },
      { status: 413 }
    )
  }
  let file: File
  try {
    const value = (await req.formData()).get("file")
    if (!(value instanceof File)) throw new Error("Missing file")
    file = value
  } catch {
    return Response.json({ error: "Choose an image file" }, { status: 400 })
  }
  if (file.size === 0 || file.size > MAX_IMAGE_BYTES) {
    return Response.json(
      { error: "Images must be nonempty and 4 MB or smaller" },
      { status: 413 }
    )
  }
  const bytes = await file.arrayBuffer()
  const contentType = detectImageType(new Uint8Array(bytes))
  if (!contentType || contentType !== file.type) {
    return Response.json(
      { error: "Choose a JPEG, PNG, WebP, or GIF image" },
      { status: 400 }
    )
  }
  try {
    const key = crypto.randomUUID()
    await portfolioStore("images").set(key, bytes, {
      metadata: { contentType },
    })
    return Response.json({ url: `/api/images/${key}` }, { status: 201 })
  } catch {
    return Response.json(
      { error: "Image storage is unavailable. Try again." },
      { status: 503 }
    )
  }
}
