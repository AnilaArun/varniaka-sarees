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

    // Get line items from the session
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id)

    // Reduce stock for each product
    for (const item of lineItems.data) {
      const productId = item.price?.metadata?.product_id

      if (productId) {
        // Get current stock
        const { data: product } = await supabaseAdmin
          .from("products")
          .select("stock")
          .eq("id", productId)
          .single()

        if (product && product.stock > 0) {
          // Reduce stock by quantity ordered
          const newStock = Math.max(0, product.stock - (item.quantity || 1))
          
          await supabaseAdmin
            .from("products")
            .update({ stock: newStock })
            .eq("id", productId)

          console.log(`Reduced stock for product ${productId}: ${product.stock} -> ${newStock}`)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
