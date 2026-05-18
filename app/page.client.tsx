"use client"

import type { Look } from "@/lib/types"
import { PortfolioGrid } from "@/components/portfolio-grid"
import { motion, Variants } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"
import { Marquee } from "@/components/ui/marquee"
import { FloatingDecor } from "@/components/ui/floating-decor"
import { ScrollProgress } from "@/components/ui/scroll-progress"
import { SocialLinks } from "@/components/social-links"

export default function Page({ looks }: { looks: Look[] }) {
  const featuredLook = looks[0]
  const remainingLooks = looks.slice(1)

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { x: -30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 12,
      },
    },
  }

  return (
    <main className="relative min-h-svh overflow-hidden">
      <ScrollProgress />
      {/* Split-Screen Hero */}
      <section className="relative flex min-h-[90vh] flex-col overflow-hidden border-b-2 border-border md:flex-row">
        <div className="flex flex-1 flex-col justify-center bg-main p-8 md:p-16 lg:p-24">
          <FloatingDecor />
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            <motion.div
              variants={itemVariants}
              className="mb-6 flex items-center gap-2"
            >
              <span className="h-0.5 w-12 bg-main-foreground" />
              <span className="font-heading tracking-tighter text-main-foreground uppercase">
                Makeup Artistry
              </span>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-6xl leading-none font-heading sm:text-8xl lg:text-9xl"
            >
              The <br /> Nex <br /> Look
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-8 max-w-md text-xl leading-snug font-base sm:text-2xl"
            >
              Something that makes you sound cool
              <span className="mt-2 block text-main-foreground/80 italic underline decoration-2 underline-offset-4">
                Second, better subtitle
              </span>
            </motion.p>
            <motion.div variants={itemVariants} className="mt-12">
              <button
                onClick={() =>
                  document
                    .getElementById("portfolio")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="group inline-flex items-center gap-4 rounded-base border-2 border-border bg-secondary-background px-8 py-4 text-xl font-heading text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
              >
                DISCOVER COLLECTION
                <ArrowRight className="size-6 transition-transform group-hover:translate-x-2" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        <div className="relative flex-1 overflow-hidden bg-background/10">
          <motion.div
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="size-full bg-border/5"
          >
            {featuredLook && (
              <img
                src={
                  featuredLook.images[featuredLook.coverIndex] ||
                  featuredLook.images[0]
                }
                alt="Hero Portfolio"
                className="size-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
              />
            )}
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-main/30 to-transparent" />
        </div>
      </section>

      {/* High-Energy Marquee */}
      <Marquee speed={15} className="!py-6">
        {[
          "FILM",
          "RUNWAY",
          "BRIDAL",
          "TELEVISION",
          "SPECIAL EFFECTS",
          "GLAMOUR",
        ].map((text) => (
          <div key={text} className="flex items-center gap-8">
            <span className="text-3xl font-heading tracking-widest text-main-foreground uppercase">
              {text}
            </span>
            <Star className="size-6 fill-main-foreground text-main-foreground" />
          </div>
        ))}
      </Marquee>

      {/* Immersive Story Section */}
      {featuredLook && (
        <section className="bg-background py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2"
            >
              <div className="order-2 lg:order-1">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="relative"
                >
                  <img
                    src={featuredLook.images[1] || featuredLook.images[0]}
                    alt={featuredLook.title}
                    className="rounded-base border-2 border-border bg-background"
                  />
                </motion.div>
              </div>
              <div className="order-1 lg:order-2">
                <span className="mb-6 inline-block rounded-base border-2 border-border bg-main px-4 py-1 text-xs font-heading text-main-foreground uppercase">
                  Latest Project
                </span>
                <h2 className="mb-8 text-5xl leading-tight font-heading sm:text-7xl">
                  {featuredLook.title}
                </h2>
                <p className="mb-10 text-xl leading-relaxed font-base text-foreground/70 sm:text-2xl">
                  &quot;{featuredLook.description}&quot;
                </p>
                <button
                  onClick={() =>
                    document
                      .getElementById("portfolio")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="group flex items-center gap-3 text-2xl font-heading"
                >
                  <span className="underline decoration-main decoration-4 underline-offset-8 transition-all group-hover:text-main">
                    DISCOVER COLLECTION
                  </span>
                  <ArrowRight className="size-8 transition-transform group-hover:translate-x-3" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Asymmetric Portfolio Section */}
      <section id="portfolio" className="bg-background pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-20 flex flex-col items-center text-center">
            <h2 className="text-7xl leading-none font-heading opacity-10 sm:text-9xl">
              GALLERY
            </h2>
            <div className="-mt-12 sm:-mt-16">
              <h2 className="text-4xl font-heading sm:text-6xl">
                THE COLLECTION
              </h2>
            </div>
          </div>
          <PortfolioGrid looks={remainingLooks} />
        </div>
      </section>

      {/* Closing Marquee */}
      <Marquee
        direction="right"
        speed={20}
        className="!bg-secondary-background"
      >
        <span className="px-4 text-2xl font-heading tracking-widest text-foreground uppercase">
          LET&apos;S CREATE SOMETHING UNFORGETTABLE • AVAILABLE FOR BOOKING •
          STUDIO OPEN NOW •{" "}
        </span>
      </Marquee>
    </main>
  )
}
