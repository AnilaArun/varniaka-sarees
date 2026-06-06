import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase/server"
import { ProductActionsDB } from "@/components/product-actions-db"
import { ProductImageGallery } from "@/components/product-image-gallery"

type ProductImageKey = "main" | "body" | "pallu" | "blouse" | "dummy"
type ProductImages = Partial<Record<ProductImageKey, string>>

const PRODUCT_IMAGE_LABELS: Record<ProductImageKey, string> = {
  main: "Main",
  body: "Body",
  pallu: "Pallu",
  blouse: "Blouse",
  dummy: "On dummy",
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  price_in_cents: number
  description: string
  image_url: string
  collection_id: string
  fabric: string | null
  length: string | null
  width: string | null
  blouse: string | null
  care: string | null
  stock: number
  is_active: boolean
  product_images?: ProductImages | null
  collection?: {
    id: string
    name: string
    slug: string
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  // Check if id is a UUID or a slug
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  
  // Fetch product from database by UUID or slug
  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      collection:collections(id, name, slug)
    `)
    .eq(isUUID ? "id" : "slug", id)
    .eq("is_active", true)
    .single()

  if (!product) {
    notFound()
  }

  // Fetch related products from the same collection
  let relatedProducts: Product[] = []
  if (product.collection_id) {
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("collection_id", product.collection_id)
      .eq("is_active", true)
      .neq("id", product.id)
      .limit(3)
    
    relatedProducts = data || []
  }

  // Map old/inconsistent collection slugs to correct page routes
  const slugToRoute: Record<string, string> = {
    "maheswari-cotton": "maheshwari-cotton",
  }

  const collectionSlug = product.collection?.slug || ""
  const correctedSlug = slugToRoute[collectionSlug] || collectionSlug
  const rootCollectionRoutes = new Set([
    "silk-sarees",
    "semi-silk",
    "banarasi",
    "maheshwari-cotton",
    "kalyani-cotton",
    "mul-cotton",
    "linen",
    "organza",
    "kerala-sarees",
  ])

  const categoryHref = correctedSlug
    ? rootCollectionRoutes.has(correctedSlug)
      ? `/${correctedSlug}`
      : `/collections/${correctedSlug}`
    : "/all-sarees"
  
  const categoryLabel = product.collection?.name || "All Sarees"
  const productImages = ([
    ["main", product.product_images?.main || product.image_url],
    ["body", product.product_images?.body],
    ["pallu", product.product_images?.pallu],
    ["blouse", product.product_images?.blouse],
    ["dummy", product.product_images?.dummy],
  ] as Array<[ProductImageKey, string | undefined | null]>)
    .filter((entry): entry is [ProductImageKey, string] => Boolean(entry[1]))
    .filter((entry, index, entries) => {
      return entries.findIndex((other) => other[1] === entry[1]) === index
    })
    .map(([key, url]) => ({ key, label: PRODUCT_IMAGE_LABELS[key], url }))

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <section className="border-b border-border bg-card px-6 py-4 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link
              href={categoryHref}
              className="transition-colors hover:text-foreground"
            >
              {categoryLabel}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Product Detail */}
      <section className="px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href={categoryHref}
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {categoryLabel}
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            <ProductImageGallery
              images={productImages}
              productName={product.name}
              stock={product.stock}
            />

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-xs tracking-[0.3em] text-accent">
                {categoryLabel.toUpperCase()}
              </span>
              <h1 className="mt-2 font-serif text-3xl text-foreground md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold text-accent">
                £{parseFloat(product.price).toFixed(2)}
              </p>

              <p className="mt-6 leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Product Details */}
              {(product.fabric || product.length || product.width || product.blouse || product.care) && (
                <div className="mt-8 space-y-4 border-t border-border pt-8">
                  <h2 className="font-serif text-lg text-foreground">
                    Product Details
                  </h2>
                  <dl className="space-y-3 text-sm">
                    {product.fabric && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Fabric
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.fabric}
                        </dd>
                      </div>
                    )}
                    {product.length && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Length
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.length}
                        </dd>
                      </div>
                    )}
                    {product.width && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Width
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.width}
                        </dd>
                      </div>
                    )}
                    {product.blouse && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Blouse
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.blouse}
                        </dd>
                      </div>
                    )}
                    {product.care && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Care
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.care}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Add to Cart */}
              <ProductActionsDB product={product} />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-border bg-card px-6 py-16 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center font-serif text-2xl text-foreground md:text-3xl">
              You May Also Like
            </h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group overflow-hidden rounded-lg border border-border bg-background transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {relatedProduct.image_url ? (
                      <img
                        src={relatedProduct.image_url}
                        alt={relatedProduct.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-foreground">
                      {relatedProduct.name}
                    </h3>
                    <p className="mt-1 text-accent">£{parseFloat(String(relatedProduct.price)).toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
