"use client"

import { SocialLinks } from "@/components/social-links"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t-4 border-border bg-main">
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <h2 className="text-6xl leading-none font-heading text-main-foreground sm:text-8xl">
              LET&apos;S <br /> CONNECT
            </h2>
            <p className="mt-8 max-w-md text-xl font-base text-main-foreground/80 sm:text-2xl">
              Ready to transform your look? Follow for daily inspiration or
              reach out for bookings.
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-12 lg:items-end lg:justify-between">
            <SocialLinks className="justify-center lg:justify-end" />

            <Button
              variant="neutral"
              size="icon"
              onClick={scrollToTop}
              className="size-16 rounded-full border-4"
              aria-label="Back to top"
            >
              <ArrowUp className="size-8" />
            </Button>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center justify-between border-t-4 border-border pt-12 font-base text-main-foreground md:flex-row">
          <div className="mb-8 md:mb-0">
            <h3 className="text-2xl font-heading tracking-tighter uppercase">
              The Nex Look
            </h3>
          </div>
          <a
            href="https://samkatevatis.polli.page/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg italic underline decoration-2 underline-offset-4 transition-colors hover:text-secondary-background"
          >
            Built by Sam Katevatis
          </a>
        </div>
      </div>
    </footer>
  )
}
