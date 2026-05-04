'use client'

import { useCallback, useState } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Loader2 } from 'lucide-react'

import { startCheckoutSession, reduceStockAfterPurchase, type CartItem } from '@/app/actions/stripe'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutProps {
  cartItems: CartItem[]
  onComplete?: () => void
}

export default function Checkout({ cartItems, onComplete }: CheckoutProps) {
  const [error, setError] = useState<string | null>(null)

  // Handle checkout completion - reduce stock and notify parent
  const handleComplete = useCallback(() => {
    // Reduce stock in database (fire and forget - don't block the UI)
    reduceStockAfterPurchase(cartItems).catch(console.error)
    // Call parent onComplete callback
    onComplete?.()
  }, [cartItems, onComplete])

  const fetchClientSecret = useCallback(async () => {
    try {
      const { clientSecret } = await startCheckoutSession(cartItems)
      if (!clientSecret) {
        throw new Error('Failed to create checkout session')
      }
      return clientSecret
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      throw err
    }
  }, [cartItems])

  if (error) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-6 text-center">
        <p className="text-destructive">{error}</p>
        <button
          onClick={() => setError(null)}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div id="checkout" className="min-h-[400px]">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete: handleComplete,
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
