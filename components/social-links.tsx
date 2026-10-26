"use client"

import { Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/the_nex_look/",
    icon: ({ className }: { className?: string }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
    color: "hover:bg-violet hover:text-white",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@the_nex_look",
    icon: ({ className }: { className?: string }) => (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      >
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    ),
    color: "hover:bg-main hover:text-main-foreground",
  },

  {
    name: "Email",
    href: "mailto:thenexlookmakeup@gmail.com",
    icon: Mail,
    color: "hover:bg-yellow hover:text-foreground",
  },
]

export function SocialLinks({ className }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {SOCIALS.map((social) => (
        <Button
          key={social.name}
          variant="neutral"
          size="lg"
          asChild
          className={`group h-14 gap-3 px-6 text-lg ${social.color}`}
        >
          <a href={social.href} target="_blank" rel="noopener noreferrer">
            <social.icon className="size-6" />
            <span className="font-heading uppercase">{social.name}</span>
            <ExternalLink className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </a>
        </Button>
      ))}
    </div>
  )
}
