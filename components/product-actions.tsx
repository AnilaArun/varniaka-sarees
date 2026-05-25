"use client"

import Link from "next/link"
import { AddToCartButton } from "@/components/add-to-cart-button"
import type { Product } from "@/lib/products"

interface ProductActionsProps {
  product: Product
}

export function ProductActions({ product }: ProductActionsProps) {
  return (
    <div className="mt-8 space-y-4 border-t border-border pt-8">
      <AddToCartButton product={product} size="lg" className="w-full md:w-auto" />
      <p className="text-sm text-muted-foreground">
        Have questions? Contact us for availability and custom orders.
      </p>
      <Link
        href="/#contact"
        className="inline-block text-sm text-accent underline-offset-4 hover:underline"
      >
        Contact Us
      </Link>
    </div>
  )
}
