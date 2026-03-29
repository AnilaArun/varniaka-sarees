import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { ProductCard } from "@/components/product-card"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  price_in_cents: number
  description: string
  image_url: string
  collection_id: string
  is_active: boolean
}

export default async function HandloomCottonPage() {
  const supabase = await createClient()
  
  // First get the Handloom Cotton collection
  const { data: collection } = await supabase
    .from("collections")
    .select("id, name, description")
    .or("slug.eq.handloom-cotton,slug.eq.maheswari-cotton,name.ilike.%cotton%")
    .limit(1)
    .single()
  
  // Get products from this collection
  let products: Product[] = []
  if (collection) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("collection_id", collection.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    
    products = data || []
  } else {
    // Fallback: get all cotton-related products
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
    
    products = data || []
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-primary-foreground/80 transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="block text-xs tracking-[0.4em] text-accent/80">
            COLLECTION
          </span>
          <h1 className="mt-4 font-serif text-4xl text-primary-foreground md:text-5xl lg:text-6xl">
            Handloom Cotton
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
            Discover our exquisite collection of handloom cotton sarees.
            Handcrafted with traditional techniques, each piece celebrates the
            timeless beauty of Indian handloom weaving.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <span className="text-xs tracking-[0.4em] text-muted-foreground">
              HANDLOOM COTTON
            </span>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
              Everyday Elegance
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Soft, lightweight, and breathable - perfect for all occasions.
            </p>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-lg font-semibold text-accent">
                      £{product.price.toFixed(2)}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    <Link
                      href={`/product/${product.id}`}
                      className="mt-4 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                No products available in this collection yet.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
