"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
  badge?: string
  badgeClassName?: string
}

export function ProductCard({ product, badge, badgeClassName }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceInCents: product.priceInCents,
      image: product.image,
    })
  }

  return (
    <div className="group overflow-hidden rounded-lg border border-border bg-card">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
          {badge && (
            <span className={`absolute left-3 top-3 px-3 py-1 text-[10px] tracking-wider ${badgeClassName}`}>
              {badge}
            </span>
          )}
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-serif text-lg text-foreground hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-lg font-medium text-accent">
          {product.price}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/product/${product.id}`}
            className="flex-1 rounded-md border border-primary px-4 py-2.5 text-center text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-primary-foreground transition-colors hover:bg-primary/90"
            aria-label="Add to cart"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
