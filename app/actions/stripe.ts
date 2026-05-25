'use server'

import { getStripe } from '@/lib/stripe'
import { getProductById } from '@/lib/products'
import { createClient } from '@/lib/supabase/server'

export interface CartItem {
  id: string
  quantity: number
}

// Helper to get product from database or static file
async function getProduct(id: string) {
  const supabase = await createClient()
  
  // First try database (prioritize DB products over static ones)
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
  
  // Fall back to static products if not in database
  const staticProduct = getProductById(id)
  if (staticProduct) {
    return {
      id: staticProduct.id,
      name: staticProduct.name,
      description: staticProduct.description,
      priceInCents: staticProduct.priceInCents,
      stock: 0, // Static products without DB entry should show as out of stock for inventory purposes
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
        },
        unit_amount: product.priceInCents,
      },
      quantity: item.quantity,
    }
  }))

  // Create Checkout Session with embedded UI
  // Store cart items in session metadata for webhook to use
  const stripe = getStripe()
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
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
  }
}

export async function reduceStockAfterPurchase(cartItems: CartItem[]) {
  const supabase = await createClient()
  
  for (const item of cartItems) {
    // Get current stock
    const { data: product, error: getError } = await supabase
      .from('products')
      .select('stock, name')
      .eq('id', item.id)
      .single()
    
    if (getError || !product) {
      console.error(`Failed to get product ${item.id}:`, getError)
      continue
    }
    
    // Reduce stock
    const newStock = Math.max(0, product.stock - item.quantity)
    
    const { error: updateError } = await supabase
      .from('products')
      .update({ stock: newStock })
      .eq('id', item.id)
    
    if (updateError) {
      console.error(`Failed to update stock for ${item.id}:`, updateError)
    } else {
      console.log(`Reduced stock for "${product.name}": ${product.stock} -> ${newStock}`)
    }
  }
}
