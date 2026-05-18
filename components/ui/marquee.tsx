"use client"

import { motion, Variants } from "framer-motion"
import { ReactNode } from "react"

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
  const containerVariants: Variants = {
    animate: {
      x: direction === "left" ? [0, -1000] : [-1000, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: speed,
          ease: "linear",
        },
      },
    },
  }

  return (
    <div
      className={`flex overflow-hidden border-y-2 border-border bg-main py-4 ${className}`}
    >
      <motion.div
        variants={containerVariants}
        animate="animate"
        className="flex whitespace-nowrap"
      >
        <div className="flex shrink-0 items-center gap-8 px-4">
          {children}
          {children}
          {children}
          {children}
          {children}
          {children}
          {children}
          {children}
        </div>
      </motion.div>
    </div>
  )
}
