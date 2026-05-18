import { cookies } from "next/headers"
import { getLooks, createLook } from "@/lib/looks"
import { verifySessionToken } from "@/lib/auth"

export async function GET() {
  const looks = getLooks()
  return Response.json(looks)
}

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  if (!session || !verifySessionToken(session.value)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const data = await req.json()
    if (!data.title || !data.images?.length) {
      return Response.json(
        { error: "Title and at least one image required" },
        { status: 400 }
      )
    }

    const look = createLook({
      title: data.title,
      description: data.description || "",
      images: data.images,
      coverIndex: data.coverIndex ?? 0,
    })

    return Response.json(look, { status: 201 })
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }
}
