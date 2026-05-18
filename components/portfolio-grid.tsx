"use client"

import { useState } from "react"
import type { Look } from "@/lib/types"
import { LookCard } from "@/components/look-card"
import { LookDialog } from "@/components/look-dialog"
import { motion, Variants } from "framer-motion"

export function PortfolioGrid({ looks }: { looks: Look[] }) {
  const [selectedLook, setSelectedLook] = useState<Look | null>(null)

  if (looks.length === 0) {
    return (
      <div className="rounded-base border-2 border-border bg-background p-12 text-center shadow-shadow">
        <p className="text-lg font-heading">No looks yet</p>
        <p className="mt-2 text-sm font-base">
          Visit the studio to add your first look.
        </p>
      </div>
    )
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12"
      >
        {looks.map((look, index) => {
          // Asymmetric layout logic
          const isWide = index % 3 === 0
          const offset = index % 2 === 0 ? "mt-0" : "lg:mt-24"

          return (
            <motion.div
              key={look.id}
              variants={itemVariants}
              className={` ${isWide ? "lg:col-span-8" : "lg:col-span-4"} ${offset} `}
            >
              <LookCard look={look} onClick={() => setSelectedLook(look)} />
            </motion.div>
          )
        })}
      </motion.div>
      <LookDialog look={selectedLook} onClose={() => setSelectedLook(null)} />
    </>
  )
}
