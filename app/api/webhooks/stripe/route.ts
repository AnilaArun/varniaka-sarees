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

    // Get line items from the session with expanded product data
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product']
    })

    console.log("[v0] Processing checkout session:", session.id)
    console.log("[v0] Line items count:", lineItems.data.length)

    // Reduce stock for each product
    for (const item of lineItems.data) {
      // Get product metadata from the expanded product object
      const product = item.price?.product as Stripe.Product | undefined
      const productId = product?.metadata?.product_id

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
          
          const { error: updateError } = await supabaseAdmin
            .from("products")
            .update({ stock: newStock })
            .eq("id", productId)

          console.log(`[v0] Reduced stock for "${dbProduct.name}" (${productId}): ${dbProduct.stock} -> ${newStock}`, updateError ? `Error: ${updateError}` : "Success")
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
