import { cookies } from "next/headers"
import { verifySessionToken } from "@/lib/auth"
import { LoginForm } from "@/app/studio/components/login-form"
import { LookManager } from "@/app/studio/components/look-manager"

export default async function StudioPage() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")
  const isAuthenticated = session
    ? verifySessionToken(session.value)
    : false

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <LoginForm />
      </main>
    )
  }

  return (
    <main className="min-h-svh p-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl">Studio</h1>
          <a
            href="/"
            className="rounded-base border-2 border-border bg-secondary-background px-4 py-2 font-base text-sm shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
          >
            View Portfolio
          </a>
        </div>
        <LookManager />
      </div>
    </main>
  )
}
