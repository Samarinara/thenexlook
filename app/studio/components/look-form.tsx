"use client"

import { useState } from "react"
import type { Look } from "@/lib/types"
import { MAX_IMAGE_BYTES } from "@/lib/images"
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
  const [uploading, setUploading] = useState(false)
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
      const url = look ? `/api/looks/${look.id}` : "/api/looks"
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
        <label htmlFor="title" className="text-sm font-base">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="rounded-base border-2 border-border bg-secondary-background p-2 text-sm font-base outline-none focus:ring-2 focus:ring-ring"
          placeholder="e.g. Golden Hour Glam"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="description" className="text-sm font-base">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-base border-2 border-border bg-secondary-background p-2 text-sm font-base outline-none focus:ring-2 focus:ring-ring"
          placeholder="Describe the look, products used, inspiration..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-base">Images</label>

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
                  aria-label={`Remove image ${i + 1}`}
                  className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}

        <label htmlFor="images" className="text-sm font-base">
          Add images (JPEG, PNG, WebP, GIF; up to 4 MB each)
        </label>
        <input
          id="images"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={uploading || saving}
          onChange={async (event) => {
            const files = Array.from(event.currentTarget.files || [])
            event.currentTarget.value = ""
            setError("")
            if (files.some((file) => file.size > MAX_IMAGE_BYTES)) {
              setError("Images must be 4 MB or smaller")
              return
            }
            setUploading(true)
            try {
              // Upload separately so a multi-image selection fits function payload limits.
              for (const file of files) {
                const body = new FormData()
                body.set("file", file)
                const response = await fetch("/api/uploads", {
                  method: "POST",
                  body,
                })
                if (!response.ok) {
                  const data = await response.json().catch(() => ({}))
                  throw new Error(data.error || "Image upload failed")
                }
                const data = await response.json()
                setImages((previous) => [...previous, data.url])
              }
            } catch (error) {
              setError(
                error instanceof Error ? error.message : "Image upload failed"
              )
            } finally {
              setUploading(false)
            }
          }}
        />
        {uploading && (
          <p role="status" className="text-sm font-base">
            Uploading images...
          </p>
        )}
      </div>

      {error && <p className="text-sm font-base text-red-600">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || uploading}>
          {saving ? "Saving..." : look ? "Update Look" : "Create Look"}
        </Button>
        <Button
          type="button"
          variant="neutral"
          onClick={onCancel}
          disabled={saving || uploading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
