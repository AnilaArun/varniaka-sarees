'use server'

import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export interface CartItem {
  id: string
  quantity: number
}

// Helper to get product from database
async function getProduct(id: string) {
  const supabase = await createClient()
  
  const { data: dbProduct, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error || !dbProduct) {
    return null
  }

  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description || '',
    priceInCents: dbProduct.price_in_cents,
    stock: dbProduct.stock || 0,
  }
}

export async function startCheckoutSession(cartItems: CartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // Validate all products and build line items
  const lineItems = await Promise.all(cartItems.map(async (item) => {
    const product = await getProduct(item.id)
    if (!product) {
      throw new Error(`Product with id "${item.id}" not found`)
    }
    
    // Check stock
    if (product.stock < item.quantity) {
      throw new Error(`Not enough stock for "${product.name}". Available: ${product.stock}`)
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
  }))

  // Create Checkout Session with embedded UI
  // Store cart items in session metadata for webhook to use
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded_page',
    redirect_on_completion: 'never',
    line_items: lineItems,
    mode: 'payment',
    metadata: {
      cart_items: JSON.stringify(cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
      }))),
    },
    shipping_address_collection: {
      allowed_countries: ['GB', 'US', 'IN', 'CA', 'AU'],
    },
    billing_address_collection: 'required',
    shipping_options: [
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 499,
            currency: 'gbp',
          },
          display_name: 'Standard Delivery',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 5,
            },
            maximum: {
              unit: 'business_day',
              value: 7,
            },
          },
        },
      },
      {
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: 1200,
            currency: 'gbp',
          },
          display_name: 'Express Delivery',
          delivery_estimate: {
            minimum: {
              unit: 'business_day',
              value: 1,
            },
            maximum: {
              unit: 'business_day',
              value: 3,
            },
          },
        },
      },
    ],
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
