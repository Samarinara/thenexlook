"use client"

import { useState } from "react"
import type { Look } from "@/lib/types"
import { UploadDropzone } from "@/lib/uploadthing"
import { Button } from "@/components/ui/button"

export function LookForm({
  look,
  onSave,
  onCancel,
}: {
  look: Look | null
  onSave: () => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(look?.title || "")
  const [description, setDescription] = useState(look?.description || "")
  const [images, setImages] = useState<string[]>(look?.images || [])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Title is required")
      return
    }
    if (images.length === 0) {
      setError("At least one image is required")
      return
    }

    setSaving(true)
    try {
      const url = look
        ? `/api/looks/${look.id}`
        : "/api/looks"
      const method = look ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          images,
          coverIndex: 0,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to save")
        return
      }

      onSave()
    } catch {
      setError("Something went wrong")
    } finally {
      setSaving(false)
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-base text-sm">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-base border-2 border-border bg-secondary-background p-2 font-base text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g. Golden Hour Glam"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="font-base text-sm">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-base border-2 border-border bg-secondary-background p-2 font-base text-sm outline-none focus:ring-2 focus:ring-ring"
          placeholder="Describe the look, products used, inspiration..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-base text-sm">Images</label>

        {images.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {images.map((url, i) => (
              <div
                key={i}
                className="group relative size-24 overflow-hidden rounded-base border-2 border-border"
              >
                <img
                  src={url}
                  alt={`Upload ${i + 1}`}
                  className="size-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <UploadDropzone
          endpoint="lookImage"
          config={{ mode: "auto" }}
          onClientUploadComplete={(res) => {
            console.log("UploadThing response:", res)
            const urls = res.map((f) => f.ufsUrl || f.url)
            console.log("Extracted URLs:", urls)
            setImages((prev) => [...prev, ...urls])
          }}
          onUploadError={(err) => {
            console.error("UploadThing error:", err)
            setError(err.message)
          }}
        />
      </div>

      {error && (
        <p className="font-base text-sm text-red-600">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : look ? "Update Look" : "Create Look"}
        </Button>
        <Button
          type="button"
          variant="neutral"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
