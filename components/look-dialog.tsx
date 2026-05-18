"use client"

import { useState, useEffect, useCallback } from "react"
import type { Look } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

export function LookDialog({
  look,
  onClose,
}: {
  look: Look | null
  onClose: () => void
}) {
  return (
    <Dialog open={!!look} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
        {look && <LookCarousel look={look} />}
      </DialogContent>
    </Dialog>
  )
}

function LookCarousel({ look }: { look: Look }) {
  const [api, setApi] = useState<CarouselApi>(undefined)
  const [current, setCurrent] = useState(0)

  const onSelect = useCallback(
    (emblaApi: CarouselApi) => {
      if (!emblaApi) return
      setCurrent(emblaApi.selectedScrollSnap())
    },
    []
  )

  useEffect(() => {
    if (!api) return
    onSelect(api)
    api.on("select", onSelect)
    return () => {
      api.off("select", onSelect)
    }
  }, [api, onSelect])

  return (
    <>
      <DialogTitle className="mb-4 text-xl">{look.title}</DialogTitle>

      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {look.images.map((img, i) => (
            <CarouselItem key={i}>
              <div className="flex flex-col gap-4">
                <img
                  src={img}
                  alt={`${look.title} — ${i + 1}`}
                  className="aspect-[4/5] w-full rounded-base border-2 border-border object-cover"
                />
                <p className="font-base text-sm leading-relaxed">
                  {look.description}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {look.images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>

      {look.images.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {look.images.map((_, i) => (
            <button
              key={i}
              onClick={() => api?.scrollTo(i)}
              className={`size-2.5 rounded-full transition-colors ${
                i === current ? "bg-main" : "bg-border"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </>
  )
}
