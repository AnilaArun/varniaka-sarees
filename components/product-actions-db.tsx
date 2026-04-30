"use client"

import { ShoppingBag, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  price_in_cents: number
  image_url: string
  stock: number
}

export function ProductActionsDB({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: `£${product.price.toFixed(2)}`,
      priceInCents: product.price_in_cents,
      image: product.image_url,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const isOutOfStock = product.stock === 0

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
          onClick={handleAddToCart}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {added ? (
            <>
              <Check className="h-4 w-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Add to Cart
            </>
          )}
        </button>
      )}
    </div>
  )
}
