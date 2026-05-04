import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "Organza Sarees | Varnikaakreations",
  description:
    "Discover our exquisite collection of Organza sarees with delicate embroidery and modern appeal.",
}

interface Product {
  id: string
  name: string
  price: number
  image_url: string
  stock: number
}

export default async function OrganzaPage() {
  const supabase = await createClient()
  
  const { data: dbProducts } = await supabase
    .from('products')
    .select('id, name, price, image_url, stock')
    .eq('collection', 'organza')
    .order('created_at', { ascending: false })

  const products: Product[] = dbProducts || []

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
        <Image
          src="/images/organza-saree.jpg"
          alt="Organza Sarees Collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-primary/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-primary-foreground">
            <h1 className="font-serif text-4xl tracking-wide md:text-5xl lg:text-6xl">
              Organza Sarees
            </h1>
            <p className="mx-auto mt-4 max-w-2xl px-4 text-sm tracking-wider text-primary-foreground/90 md:text-base">
              Sheer elegance with delicate embroidery and modern appeal
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <nav className="flex items-center gap-2 text-xs tracking-wider text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              HOME
            </Link>
            <span>/</span>
            <span className="text-foreground">ORGANZA SAREES</span>
          </nav>
        </div>
      </div>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        {products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">
              No Organza sarees available at the moment.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Please check back soon for new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                  <Image
                    src={product.image_url || "/images/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
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
                <div className="mt-4 text-center">
                  <h3 className="font-medium tracking-wide text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-accent">
                    £{parseFloat(String(product.price)).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Collection Story */}
      <section className="border-t border-border bg-secondary/30 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-serif text-2xl tracking-wide text-foreground md:text-3xl">
            The Art of Organza
          </h2>
          <p className="mt-6 leading-relaxed text-muted-foreground">
            Our Organza collection features sheer, lightweight sarees that embody modern elegance. 
            Each piece is crafted with delicate embroidery, subtle shimmer, and contemporary designs 
            that make them perfect for special occasions. The translucent beauty of Organza combined 
            with intricate craftsmanship creates sarees that are both sophisticated and timeless.
          </p>
        </div>
      </section>
    </main>
  )
}
