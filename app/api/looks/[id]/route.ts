import { cookies } from "next/headers"
import { getLook, updateLook, deleteLook } from "@/lib/looks"
import { verifySessionToken } from "@/lib/auth"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  if (!session || !verifySessionToken(session.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const existing = await getLook(id)
  if (!existing) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  try {
    const data = await req.json()
    const updated = await updateLook(id, data)
    return Response.json(updated)
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  if (!session || !verifySessionToken(session.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const deleted = await deleteLook(id)
  if (!deleted) {
    return Response.json({ error: "Not found" }, { status: 404 })
  }

  return Response.json({ success: true })
}
