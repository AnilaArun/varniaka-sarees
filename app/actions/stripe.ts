'use server'

import { stripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export interface CartItem {
  id: string
  quantity: number
}

// Helper to get product from database or static file
async function getProduct(id: string) {
  // First try static products
  const staticProduct = getProductById(id)
  if (staticProduct) {
    return {
      id: staticProduct.id,
      name: staticProduct.name,
      description: staticProduct.description,
      priceInCents: staticProduct.priceInCents,
      stock: 999, // Static products have unlimited stock for now
    }
  }
  
  // Then try database
  const supabase = await createClient()
  const { data: dbProduct } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (dbProduct) {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      description: dbProduct.description || '',
      priceInCents: dbProduct.price_in_cents,
      stock: dbProduct.stock || 0,
    }
  }
  
  return null
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
          metadata: {
            product_id: product.id,
          },
        },
        unit_amount: product.priceInCents,
      },
      quantity: item.quantity,
    }
  }))

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
