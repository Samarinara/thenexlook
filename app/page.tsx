import { getLooks } from "@/lib/looks"
import { PortfolioGrid } from "@/components/portfolio-grid"

export default function Page() {
  const looks = getLooks()

  return (
    <main className="min-h-svh">
      <section className="border-b-2 border-border bg-main px-6 py-16 text-main-foreground sm:px-8 sm:py-24">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-heading sm:text-6xl">The Nex Look</h1>
          <p className="mt-4 max-w-lg text-lg font-base sm:text-xl">
            Editorial makeup artistry that transforms. Each look tells a story.
          </p>
          <a
            href="/studio"
            className="mt-6 inline-block rounded-base border-2 border-border bg-secondary-background px-4 py-2 font-base text-sm text-foreground shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
          >
            Studio
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <PortfolioGrid looks={looks} />
      </section>
    </main>
  )
}
