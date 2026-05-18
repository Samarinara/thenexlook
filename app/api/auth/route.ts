import { cookies } from "next/headers"
import { createSessionToken } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { password } = await req.json()

    if (!password || password !== process.env.STUDIO_PASSWORD) {
      return Response.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = createSessionToken()
    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    })

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }
}
