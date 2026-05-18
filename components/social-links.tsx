"use client"

import { Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
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
    color: "hover:bg-[#E1306C] hover:text-white",
  },
  {
    name: "TikTok",
    href: "https://tiktok.com",
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
    color: "hover:bg-[#000000] hover:text-white",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
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
        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
      </svg>
    ),
    color: "hover:bg-[#1DA1F2] hover:text-white",
  },
  {
    name: "Email",
    href: "mailto:hello@thenexlook.com",
    icon: Mail,
    color: "hover:bg-main hover:text-main-foreground",
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
