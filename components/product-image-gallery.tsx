"use client"

import { useState } from "react"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

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
  const [zoom, setZoom] = useState(1)
  const selectedImage = images[selectedIndex]

  const selectImage = (index: number) => {
    setSelectedIndex(index)
    setZoom(1)
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        {selectedImage ? (
          <img
            src={selectedImage.url}
            alt={`${productName} - ${selectedImage.label}`}
            className="h-full w-full object-cover transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
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

        {selectedImage && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => setZoom((value) => Math.max(1, value - 0.25))}
              className="rounded-full bg-background/90 p-2 text-foreground shadow backdrop-blur-sm transition hover:bg-background"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom((value) => Math.min(3, value + 0.25))}
              className="rounded-full bg-background/90 p-2 text-foreground shadow backdrop-blur-sm transition hover:bg-background"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="rounded-full bg-background/90 p-2 text-foreground shadow backdrop-blur-sm transition hover:bg-background"
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

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
