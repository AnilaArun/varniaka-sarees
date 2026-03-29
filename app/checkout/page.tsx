"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ShoppingBag, Trash2, CheckCircle } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Checkout from "@/components/checkout"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, removeItem } = useCart()
  const [isComplete, setIsComplete] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formatPrice = (cents: number) => {
    return `£${(cents / 100).toFixed(2)}`
  }

  const handleComplete = () => {
    setIsComplete(true)
    clearCart()
  }

  if (!mounted) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
        <Footer />
      </main>
    )
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl text-foreground md:text-4xl">
              Thank You for Your Order!
            </h1>
            <p className="mt-4 text-muted-foreground">
              Your order has been successfully placed. You will receive a confirmation email shortly.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We will contact you with shipping details within 24-48 hours.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="px-6 py-24 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground/50" />
            <h1 className="mt-6 font-serif text-3xl text-foreground">
              Your Cart is Empty
            </h1>
            <p className="mt-4 text-muted-foreground">
              Add some beautiful sarees to your cart to proceed with checkout.
            </p>
            <Link
              href="/all-sarees"
              className="mt-8 inline-block rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Sarees
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const cartItems = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
  }))

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="px-6 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>

          <h1 className="font-serif text-3xl text-foreground md:text-4xl">
            Checkout
          </h1>

          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            {/* Order Summary */}
            <div className="order-2 lg:order-1">
              <h2 className="mb-6 font-serif text-xl text-foreground">
                Order Summary
              </h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 rounded-lg border border-border p-4"
                  >
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-accent">
                          {formatPrice(item.priceInCents * item.quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-accent">{formatPrice(totalPrice)}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Shipping calculated at checkout
                </p>
              </div>
            </div>

            {/* Stripe Checkout */}
            <div className="order-1 lg:order-2">
              <h2 className="mb-6 font-serif text-xl text-foreground">
                Payment
              </h2>
              <div className="rounded-lg border border-border bg-card p-4">
                <Checkout cartItems={cartItems} onComplete={handleComplete} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
