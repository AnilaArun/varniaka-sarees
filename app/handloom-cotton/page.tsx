import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

export default async function HandloomCottonPage() {
  // Fetch products from database
  const supabase = await createClient()
  
  // Get Handloom Cotton products from database
  const { data: dbProducts } = await supabase
    .from("products")
    .select(`
      *,
      collections(name, slug)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  // Filter to only products assigned to the Handloom Cotton collection.
  const cottonProducts = (dbProducts || []).filter((p: any) => 
    p.collections?.slug === 'handloom-cotton'
  )

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

      {/* Database Products Section */}
      {cottonProducts.length > 0 && (
        <section className="border-t px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <span className="text-xs tracking-[0.4em] text-muted-foreground">
                MORE COTTON SAREES
              </span>
              <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
                New Arrivals
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cottonProducts.map((product: any) => (
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
                    {product.stock === 0 && (
                      <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-[10px] tracking-wider text-primary-foreground">
                        OUT OF STOCK
                      </span>
                    )}
                    {product.stock === 1 && (
                      <div className="absolute right-2 top-2 rounded-md bg-amber-500 px-2 py-1 text-xs font-medium text-white">
                        Only 1 left
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-serif text-xl text-foreground">
                      {product.name}
                    </h3>
                    {product.collections?.name && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {product.collections.name}
                      </p>
                    )}
                    <p className="mt-2 text-lg font-semibold text-accent">
                      £{parseFloat(product.price).toFixed(2)}
                    </p>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {product.description}
                    </p>
                    {product.stock === 0 ? (
                      <button
                        disabled
                        className="mt-4 block w-full cursor-not-allowed rounded-md bg-muted px-4 py-3 text-center text-sm font-medium text-muted-foreground"
                      >
                        Out of Stock
                      </button>
                    ) : (
                      <Link
                        href={`/product/${product.id}`}
                        className="mt-4 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                      >
                        View Details
                      </Link>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
