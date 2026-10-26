"use client"

import { motion } from "framer-motion"
import { Fragment, type ReactNode } from "react"

interface MarqueeProps {
  children: ReactNode
  direction?: "left" | "right"
  speed?: number
  className?: string
}

export function Marquee({
  children,
  direction = "left",
  speed = 20,
  className = "",
}: MarqueeProps) {
  const repeatedChildren = Array.from({ length: 8 }, (_, index) => (
    <Fragment key={index}>{children}</Fragment>
  ))

  return (
    <div
      className={`flex overflow-hidden border-y-2 border-border bg-main py-4 ${className}`}
    >
      <motion.div
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        className="flex w-max whitespace-nowrap"
      >
        <div className="flex shrink-0 items-center gap-8 px-4">
          {repeatedChildren}
        </div>
        <div className="flex shrink-0 items-center gap-8 px-4" aria-hidden="true">
          {repeatedChildren}
        </div>
      </motion.div>
    </div>
  )
}
