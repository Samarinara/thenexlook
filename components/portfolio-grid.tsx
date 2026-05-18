"use client"

import { useState } from "react"
import type { Look } from "@/lib/types"
import { LookCard } from "@/components/look-card"
import { LookDialog } from "@/components/look-dialog"

export function PortfolioGrid({ looks }: { looks: Look[] }) {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null)

  if (looks.length === 0) {
    return (
      <div className="rounded-base border-2 border-border bg-background p-12 text-center shadow-shadow">
        <p className="font-heading text-lg">No looks yet</p>
        <p className="mt-2 font-base text-sm">
          Visit the studio to add your first look.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {looks.map((look) => (
          <LookCard
            key={look.id}
            look={look}
            onClick={() => setSelectedLook(look)}
          />
        ))}
      </div>
      <LookDialog
        look={selectedLook}
        onClose={() => setSelectedLook(null)}
      />
    </>
  )
}
