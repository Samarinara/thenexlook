"use client"

import { useState, FormEvent } from "react"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Invalid password")
        return
      }

      window.location.reload()
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-6 rounded-base border-2 border-border bg-background p-8 shadow-shadow"
    >
      <div>
        <h1 className="font-heading text-2xl">Studio Login</h1>
        <p className="mt-1 font-base text-sm text-foreground">
          Enter the studio password to manage your portfolio.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="font-base text-sm">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-base border-2 border-border bg-secondary-background p-2 font-base text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="••••••••"
          autoFocus
        />
        {error && (
          <p className="font-base text-xs text-destructive">{error}</p>
        )}
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Checking..." : "Enter Studio"}
      </Button>
    </form>
  )
}
