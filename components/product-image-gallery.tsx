"use client"

import { useEffect, useState, type MouseEvent } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"

interface ProductImage {
  key: string
  label: string
  url: string
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  stock: number
}

export function ProductImageGallery({
  images,
  productName,
  stock,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 })
  const [isMagnifierVisible, setIsMagnifierVisible] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalZoom, setModalZoom] = useState(1)
  const selectedImage = images[selectedIndex]

  const selectImage = (index: number) => {
    setSelectedIndex(index)
    setModalZoom(1)
    setIsMagnifierVisible(false)
  }

  const navigateImage = (direction: "previous" | "next") => {
    if (images.length < 2) return

    setSelectedIndex((currentIndex) => {
      if (direction === "previous") {
        return currentIndex === 0 ? images.length - 1 : currentIndex - 1
      }

      return currentIndex === images.length - 1 ? 0 : currentIndex + 1
    })
    setModalZoom(1)
    setIsMagnifierVisible(false)
  }

  const updateZoomPosition = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100

    setZoomPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false)
        setModalZoom(1)
      }
      if (event.key === "ArrowLeft") {
        navigateImage("previous")
      }
      if (event.key === "ArrowRight") {
        navigateImage("next")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [isModalOpen, images.length])

  return (
    <div className="relative space-y-4">
      <div
        className="group relative aspect-[4/5] cursor-zoom-in overflow-hidden rounded-lg bg-muted"
        role="button"
        tabIndex={0}
        aria-label={`Enlarge ${productName}`}
        onClick={() => selectedImage && setIsModalOpen(true)}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && selectedImage) {
            event.preventDefault()
            setIsModalOpen(true)
          }
        }}
        onMouseEnter={() => setIsMagnifierVisible(true)}
        onMouseLeave={() => setIsMagnifierVisible(false)}
        onMouseMove={updateZoomPosition}
      >
        {selectedImage ? (
          <img
            src={selectedImage.url}
            alt={`${productName} - ${selectedImage.label}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {stock === 0 && (
          <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-[10px] tracking-wider text-primary-foreground">
            OUT OF STOCK
          </span>
        )}
        {stock === 1 && (
          <span className="absolute left-3 top-3 bg-amber-500 px-3 py-1 text-[10px] tracking-wider text-white">
            ONLY 1 LEFT
          </span>
        )}

        {images.length > 1 && selectedImage && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                navigateImage("previous")
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 text-foreground shadow backdrop-blur-sm transition hover:bg-background"
              aria-label="Show previous product image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                navigateImage("next")
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/90 p-2 text-foreground shadow backdrop-blur-sm transition hover:bg-background"
              aria-label="Show next product image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {selectedImage && (
          <span className="absolute bottom-3 right-3 rounded-full bg-background/90 p-2 text-foreground shadow backdrop-blur-sm transition group-hover:bg-background">
            <Maximize2 className="h-4 w-4" />
          </span>
        )}
      </div>

      {selectedImage && isMagnifierVisible && (
        <div
          className="pointer-events-none absolute left-[calc(100%+1rem)] top-0 z-30 hidden aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-lg border bg-background shadow-xl lg:block"
          aria-hidden="true"
          style={{
            backgroundImage: `url(${selectedImage.url})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "240%",
          }}
        />
      )}

      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} enlarged image`}
        >
          <button
            type="button"
            onClick={() => {
              setIsModalOpen(false)
              setModalZoom(1)
            }}
            className="absolute right-4 top-4 rounded-full bg-foreground p-2 text-background transition hover:bg-foreground/80"
            aria-label="Close enlarged image"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 right-4 z-10 flex gap-2">
            <button
              type="button"
              onClick={() => setModalZoom((value) => Math.max(1, value - 0.25))}
              className="rounded-full bg-foreground p-2 text-background transition hover:bg-foreground/80"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setModalZoom((value) => Math.min(3, value + 0.25))}
              className="rounded-full bg-foreground p-2 text-background transition hover:bg-foreground/80"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setModalZoom(1)}
              className="rounded-full bg-foreground p-2 text-background transition hover:bg-foreground/80"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => navigateImage("previous")}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-foreground p-3 text-background transition hover:bg-foreground/80"
                aria-label="Show previous product image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => navigateImage("next")}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-foreground p-3 text-background transition hover:bg-foreground/80"
                aria-label="Show next product image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="h-full max-h-[90vh] w-full max-w-5xl overflow-auto">
            <img
              src={selectedImage.url}
              alt={`${productName} - ${selectedImage.label}`}
              className="mx-auto h-auto max-h-[90vh] w-auto max-w-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${modalZoom})` }}
            />
          </div>
        </div>
      )}

      {images.length > 1 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {images.map((image, index) => {
            const isSelected = index === selectedIndex

            return (
              <button
                key={`${image.key}-${image.url}`}
                type="button"
                onClick={() => selectImage(index)}
                className={`overflow-hidden rounded-md border bg-card text-left transition ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/60"
                }`}
              >
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={image.url}
                    alt={`${productName} - ${image.label}`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <span className="block px-2 py-1.5 text-center text-xs text-muted-foreground">
                  {image.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
