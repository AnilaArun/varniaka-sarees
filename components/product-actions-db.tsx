"use client"

import { MessageCircle } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  price_in_cents: number
  image_url: string
  stock: number
}

const WHATSAPP_NUMBER = "447721943635"

export function ProductActionsDB({ product }: { product: Product }) {
  const isOutOfStock = product.stock === 0

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hi, I'm interested in ordering:\n\n` +
      `*${product.name}*\n` +
      `Price: £${product.price.toFixed(2)}\n\n` +
      `Please let me know the availability and next steps. Thank you!`
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  return (
    <div className="mt-8 space-y-4 border-t border-border pt-8">
      {product.stock === 1 && (
        <p className="text-sm font-medium text-amber-600">
          Only 1 left in stock - order soon!
        </p>
      )}
      {isOutOfStock ? (
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md bg-muted px-6 py-3 text-sm font-medium text-muted-foreground"
        >
          Out of Stock
        </button>
      ) : (
        <button
          onClick={handleWhatsAppOrder}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#128C7E]"
        >
          <MessageCircle className="h-4 w-4" />
          Order via WhatsApp
        </button>
      )}
    </div>
  )
}
