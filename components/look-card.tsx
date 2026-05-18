"use client"

import type { Look } from "@/lib/types"
import { motion } from "framer-motion"

export function LookCard({
  look,
  onClick,
}: {
  look: Look
  onClick: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative flex w-full flex-col overflow-hidden rounded-base border-2 border-border bg-background text-left shadow-shadow transition-all"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={look.images[look.coverIndex] || look.images[0]}
          alt={look.title}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <h3 className="text-xl font-heading text-white">{look.title}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-white/80">
            {look.description}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t-2 border-border p-4">
        <h3 className="text-lg font-heading">{look.title}</h3>
        <span className="rounded-full bg-main px-2 py-0.5 text-xs font-heading text-main-foreground uppercase">
          View
        </span>
      </div>
    </motion.button>
  )
}
