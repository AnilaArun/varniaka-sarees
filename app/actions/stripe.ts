'use server'

import { stripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'

export interface CartItem {
  id: string
  quantity: number
}

export async function startCheckoutSession(cartItems: CartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // Validate all products and build line items
  const lineItems = cartItems.map((item) => {
    const product = getProductById(item.id)
    if (!product) {
      throw new Error(`Product with id "${item.id}" not found`)
    }

    return {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: product.name,
          description: product.description,
        },
        unit_amount: product.priceInCents,
      },
      quantity: item.quantity,
    }
  })

  // Create Checkout Session with embedded UI
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    shipping_address_collection: {
      allowed_countries: ['GB', 'US', 'IN', 'CA', 'AU'],
    },
    billing_address_collection: 'required',
  })

  return {
    clientSecret: session.client_secret,
    sessionId: session.id,
  }
}

export async function getCheckoutSession(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
  }
}
