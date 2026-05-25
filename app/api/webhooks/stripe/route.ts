import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Create Supabase admin client for webhook (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    console.error("[v0] Webhook error: No signature provided")
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
    console.log("[v0] Webhook signature verified successfully")
  } catch (err) {
    console.error("[v0] Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  console.log("[v0] Received webhook event type:", event.type)

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("[v0] Processing checkout session:", session.id)
    console.log("[v0] Session metadata:", session.metadata)
    
    // Get cart items from session metadata
    let cartItems: Array<{ id: string; quantity: number }> = []
    if (session.metadata?.cart_items) {
      try {
        cartItems = JSON.parse(session.metadata.cart_items)
        console.log("[v0] Successfully parsed cart items:", cartItems)
      } catch (e) {
        console.error("[v0] Failed to parse cart_items from metadata:", e)
        return NextResponse.json({ error: "Failed to parse cart items" }, { status: 400 })
      }
    } else {
      console.error("[v0] No cart_items in session metadata")
      return NextResponse.json({ error: "No cart items found" }, { status: 400 })
    }

    // Reduce stock for each product
    for (const item of cartItems) {
      const productId = item.id
      const quantity = item.quantity

      console.log(`[v0] Processing product ${productId} with quantity ${quantity}`)

      if (!productId) {
        console.error("[v0] No product ID in cart item")
        continue
      }

      // Get current stock
      const { data: dbProduct, error: getError } = await supabaseAdmin
        .from("products")
        .select("stock, name")
        .eq("id", productId)
        .single()

      console.log("[v0] DB product lookup:", { productId, dbProduct, error: getError })

      if (getError) {
        console.error(`[v0] Error fetching product ${productId}:`, getError)
        continue
      }

      if (!dbProduct) {
        console.error(`[v0] Product not found in database: ${productId}`)
        continue
      }

      if (dbProduct.stock > 0) {
        // Reduce stock by quantity ordered
        const newStock = Math.max(0, dbProduct.stock - quantity)
        
        console.log(`[v0] Attempting to reduce stock for "${dbProduct.name}": ${dbProduct.stock} -> ${newStock}`)

        // Use optimistic locking: only update if stock hasn't changed
        // This prevents race conditions where two concurrent purchases could both succeed
        const { data: updated, error: updateError } = await supabaseAdmin
          .from("products")
          .update({ stock: newStock })
          .eq("id", productId)
          .eq("stock", dbProduct.stock) // Only update if stock is still the same
          .select()

        if (updateError) {
          console.error(`[v0] Error updating stock for ${productId}:`, updateError)
        } else if (!updated || updated.length === 0) {
          console.warn(`[v0] RACE CONDITION DETECTED: Stock changed for "${dbProduct.name}" (${productId}). Another purchase may have been processed simultaneously.`)
        } else {
          console.log(`[v0] Successfully reduced stock for "${dbProduct.name}" (${productId}): ${dbProduct.stock} -> ${newStock}`)
        }
      } else {
        console.warn(`[v0] Cannot reduce stock - product already out of stock: "${dbProduct.name}"`)
      }
    }

    console.log("[v0] Checkout session processing completed")
  } else {
    console.log(`[v0] Ignoring webhook event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
