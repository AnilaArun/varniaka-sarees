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
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("[v0] Processing checkout session:", session.id)
    
    // Get cart items from session metadata
    let cartItems: Array<{ id: string; quantity: number }> = []
    if (session.metadata?.cart_items) {
      try {
        cartItems = JSON.parse(session.metadata.cart_items)
      } catch (e) {
        console.error("[v0] Failed to parse cart_items from metadata:", e)
      }
    }

    console.log("[v0] Cart items from metadata:", cartItems)

    // Reduce stock for each product
    for (const item of cartItems) {
      const productId = item.id
      const quantity = item.quantity

      console.log(`[v0] Processing product ${productId} with quantity ${quantity}`)

      if (productId) {
        // Get current stock
        const { data: dbProduct, error } = await supabaseAdmin
          .from("products")
          .select("stock, name")
          .eq("id", productId)
          .single()

        console.log("[v0] DB product:", dbProduct, "Error:", error)

        if (dbProduct && dbProduct.stock > 0) {
          // Reduce stock by quantity ordered
          const newStock = Math.max(0, dbProduct.stock - quantity)
          
          // Use optimistic locking: only update if stock hasn't changed
          // This prevents race conditions where two concurrent purchases could both succeed
          const { data: updated, error: updateError } = await supabaseAdmin
            .from("products")
            .update({ stock: newStock })
            .eq("id", productId)
            .eq("stock", dbProduct.stock) // Only update if stock is still the same
            .select()

          if (!updated || updated.length === 0) {
            console.log(`[v0] RACE CONDITION DETECTED: Stock changed for "${dbProduct.name}" (${productId}). Another purchase may have been processed simultaneously.`)
          } else {
            console.log(`[v0] Reduced stock for "${dbProduct.name}" (${productId}): ${dbProduct.stock} -> ${newStock}`)
          }
        } else if (!dbProduct) {
          console.log(`[v0] Product not found: ${productId}`)
        }
      }
    }
  }
      }

      console.log("[v0] Processing item:", item.description, "Product ID:", productId)

      if (productId) {
        // Get current stock
        const { data: dbProduct, error } = await supabaseAdmin
          .from("products")
          .select("stock, name")
          .eq("id", productId)
          .single()

        console.log("[v0] DB product:", dbProduct, "Error:", error)

        if (dbProduct && dbProduct.stock > 0) {
          // Reduce stock by quantity ordered
          const newStock = Math.max(0, dbProduct.stock - (item.quantity || 1))
          
          // Use optimistic locking: only update if stock hasn't changed
          // This prevents race conditions where two concurrent purchases could both succeed
          const { data: updated, error: updateError } = await supabaseAdmin
            .from("products")
            .update({ stock: newStock })
            .eq("id", productId)
            .eq("stock", dbProduct.stock) // Only update if stock is still the same
            .select()

          if (!updated || updated.length === 0) {
            console.log(`[v0] RACE CONDITION DETECTED: Stock changed for "${dbProduct.name}" (${productId}). Another purchase may have been processed simultaneously.`)
          } else {
            console.log(`[v0] Reduced stock for "${dbProduct.name}" (${productId}): ${dbProduct.stock} -> ${newStock}`, updateError ? `Error: ${updateError}` : "Success")
          }
        }
      } else {
        console.log("[v0] Could not find product_id for item:", item.description)
      }
    }
  }

  return NextResponse.json({ received: true })
}
