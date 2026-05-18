"use client"

import { motion } from "framer-motion"

export function FloatingDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] top-[20%] text-main/20"
      >
        <svg width="100" height="100" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0L61.2 38.8H100L68.8 61.2L80 100L50 77.6L20 100L31.2 61.2L0 38.8H38.8L50 0Z" />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute right-[15%] top-[60%] text-main/10"
      >
        <div className="size-40 rounded-full border-4 border-current" />
      </motion.div>

      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-[10%] left-[20%] text-main/15"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="40" cy="40" r="30" strokeDasharray="10 5" />
        </svg>
      </motion.div>
    </div>
  )
}
