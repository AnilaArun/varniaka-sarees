import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"

type CollectionPageProps = {
  params: Promise<{ slug: string }>
}

type Product = {
  id: string
  name: string
  price: number
  description: string | null
  image_url: string | null
  product_images?: Record<string, string> | null
  stock: number
  collection_id: string | null
  collections?:
    | {
        name: string
        slug: string
      }
    | Array<{
        name: string
        slug: string
      }>
    | null
}

function getProductImage(product: Product) {
  return (
    product.image_url ||
    product.product_images?.main ||
    Object.values(product.product_images || {}).find(Boolean) ||
    ""
  )
}

function normalize(value: string | null | undefined) {
  return value?.toLowerCase().trim() || ""
}

function getProductCollection(product: Product) {
  return Array.isArray(product.collections)
    ? product.collections[0]
    : product.collections
}

function productBelongsToCollection(product: Product, collection: { id: string; name: string; slug: string }) {
  const collectionSlug = normalize(collection.slug)
  const productName = normalize(product.name)
  const productCollection = getProductCollection(product)
  const productCollectionName = normalize(productCollection?.name)
  const productCollectionSlug = normalize(productCollection?.slug)

  if (product.collection_id === collection.id || productCollectionSlug === collectionSlug) {
    return true
  }

  if (collectionSlug === "kalyani-cotton") {
    return productName.includes("kalyani") || productCollectionName.includes("kalyani")
  }

  if (collectionSlug === "maheshwari-cotton" || collectionSlug === "maheswari-cotton") {
    return (
      productName.includes("maheshwari") ||
      productName.includes("maheswari") ||
      productCollectionName.includes("maheshwari") ||
      productCollectionName.includes("maheswari") ||
      productCollectionSlug === "maheshwari-cotton" ||
      productCollectionSlug === "maheswari-cotton"
    )
  }

  return false
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from("collections")
    .select("id, name, slug, description, image_url")
    .eq("slug", slug)
    .single()

  if (!collection) {
    notFound()
  }

  const { data } = await supabase
    .from("products")
    .select("id, name, price, description, image_url, product_images, stock, collection_id, collections(name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const products = ((data || []) as unknown as Product[]).filter((product) =>
    productBelongsToCollection(product, collection)
  )

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative bg-primary px-6 py-16 lg:px-8 lg:py-24">
        {collection.image_url && (
          <img
            src={collection.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
        )}
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative mx-auto max-w-7xl">
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
            {collection.name}
          </h1>
          {collection.description && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
              {collection.description}
            </p>
          )}
        </div>
      </section>

      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? "Product" : "Products"}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      {getProductImage(product) ? (
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
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
                  </Link>
                  <div className="p-6">
                    <Link href={`/product/${product.id}`}>
                      <h2 className="font-serif text-xl text-foreground transition-colors hover:text-accent">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="mt-2 text-lg font-semibold text-accent">
                      £{parseFloat(String(product.price)).toFixed(2)}
                    </p>
                    {product.description && (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {product.description}
                      </p>
                    )}
                    <Link
                      href={`/product/${product.id}`}
                      className="mt-4 block rounded-md border border-primary px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg text-muted-foreground">
                No products are available in this collection yet.
              </p>
              <Link
                href="/#collections"
                className="mt-6 inline-block rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Browse Other Collections
              </Link>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
