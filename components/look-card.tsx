import type { Look } from "@/lib/types"

export function LookCard({
  look,
  onClick,
}: {
  look: Look
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full flex-col overflow-hidden rounded-base border-2 border-border bg-background text-left shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none"
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={look.images[look.coverIndex] || look.images[0]}
          alt={look.title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="border-t-2 border-border p-4">
        <h3 className="font-heading text-lg">{look.title}</h3>
      </div>
    </button>
  )
}
