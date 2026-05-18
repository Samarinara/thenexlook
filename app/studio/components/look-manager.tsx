"use client"

import { useEffect, useState } from "react"
import type { Look } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { LookForm } from "@/app/studio/components/look-form"

export function LookManager() {
  const [looks, setLooks] = useState<Look[]>([])
  const [loading, setLoading] = useState(true)
  const [editingLook, setEditingLook] = useState<Look | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function fetchLooks() {
    try {
      const res = await fetch("/api/looks")
      const data = await res.json()
      setLooks(data)
    } catch {
      console.error("Failed to fetch looks")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLooks()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm("Delete this look? This cannot be undone.")) return

    try {
      const res = await fetch(`/api/looks/${id}`, { method: "DELETE" })
      if (res.ok) {
        setLooks((prev) => prev.filter((l) => l.id !== id))
      }
    } catch {
      console.error("Failed to delete look")
    }
  }

  function handleEdit(look: Look) {
    setEditingLook(look)
    setShowForm(true)
  }

  function handleCreate() {
    setEditingLook(null)
    setShowForm(true)
  }

  function handleFormSave() {
    setShowForm(false)
    setEditingLook(null)
    fetchLooks()
  }

  function handleFormCancel() {
    setShowForm(false)
    setEditingLook(null)
  }

  if (loading) {
    return (
      <div className="rounded-base border-2 border-border bg-background p-12 text-center shadow-shadow">
        <p className="font-base">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {!showForm && (
        <div className="flex items-center justify-between">
          <p className="font-base text-sm text-foreground">
            {looks.length} {looks.length === 1 ? "look" : "looks"}
          </p>
          <Button onClick={handleCreate} variant="default">
            New Look
          </Button>
        </div>
      )}

      {showForm && (
        <div className="rounded-base border-2 border-border bg-background p-6 shadow-shadow">
          <h2 className="mb-4 font-heading text-xl">
            {editingLook ? "Edit Look" : "New Look"}
          </h2>
          <LookForm
            look={editingLook}
            onSave={handleFormSave}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      {!showForm && (
        <div className="flex flex-col gap-4">
          {looks.length === 0 && (
            <div className="rounded-base border-2 border-border bg-background p-12 text-center shadow-shadow">
              <p className="font-heading text-lg">No looks yet</p>
              <p className="mt-2 font-base text-sm">
                Click &quot;New Look&quot; to add your first makeup look.
              </p>
            </div>
          )}

          {looks.map((look) => (
            <div
              key={look.id}
              className="flex items-center gap-4 rounded-base border-2 border-border bg-background p-4 shadow-shadow"
            >
              <div className="size-16 shrink-0 overflow-hidden rounded-base border-2 border-border">
                <img
                  src={look.images[look.coverIndex] || look.images[0]}
                  alt={look.title}
                  className="size-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate font-heading">{look.title}</h3>
                <p className="truncate font-base text-xs text-foreground">
                  {look.images.length} image{look.images.length !== 1 && "s"}{" "}
                  &middot;{" "}
                  {new Date(look.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  onClick={() => handleEdit(look)}
                  variant="neutral"
                  size="sm"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(look.id)}
                  variant="neutral"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
