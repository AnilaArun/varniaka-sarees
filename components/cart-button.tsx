"use client"

import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"

export function CartButton() {
  const { totalItems, setIsOpen } = useCart()

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="relative flex items-center justify-center p-2 transition-colors hover:text-primary"
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  )
}
