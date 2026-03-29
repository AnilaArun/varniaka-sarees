"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/products"

interface AddToCartButtonProps {
  product: Product
  variant?: "default" | "outline"
  size?: "default" | "lg"
  className?: string
}

export function AddToCartButton({
  product,
  variant = "default",
  size = "default",
  className,
}: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceInCents: product.priceInCents,
      image: product.image,
    })
  }

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={className}
    >
      <ShoppingBag className="mr-2 h-4 w-4" />
      Add to Cart
    </Button>
  )
}
