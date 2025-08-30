"use client"

import { useState } from "react"
import { ChevronLeft, ImageIcon, X, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// MediaViewer component
export default function MediaViewer({
  media,
  initialIndex = 0,
  open,
  onOpenChange,
}: {
  media: string[]
  initialIndex?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goNext()
    else if (e.key === "ArrowLeft") goPrev()
    else if (e.key === "Escape") onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[90vw] h-[90vh] p-0 overflow-hidden bg-black/75 flex flex-col border border-gray-900"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex-shrink-0 z-10 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <ImageIcon className="h-5 w-5" />
              <span className="font-medium">
                {currentIndex + 1} / {media.length}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Media Content - Main growing area */}
        <div className="flex-grow relative flex items-center justify-center min-h-0">
          {media.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 z-10 h-12 w-12 rounded-full bg-gray-400/50 text-white hover:bg-gray-400/70"
                onClick={goPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 z-10 h-12 w-12 rounded-full bg-gray-400/50 text-white hover:bg-gray-400/70"
                onClick={goNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}

          <div className="absolute inset-0 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-full max-h-full">
              <Image
                src={media[currentIndex]}
                alt={`Report media ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
              />
            </div>
          </div>
        </div>

        {/* Thumbnail Strip */}
        {media.length > 1 && (
          <div className="flex-shrink-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {media.map((item, index) => (
                <button
                  key={index}
                  className={`relative h-16 w-16 min-w-[64px] rounded-md overflow-hidden border-2 transition-all ${
                    currentIndex === index
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  <Image
                    src={item}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
