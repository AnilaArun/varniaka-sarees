import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getProductById, getProductsByCategory, products } from "@/lib/products"
import { ProductActions } from "@/components/product-actions"

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 3)

  const categoryHref =
    product.category === "silk"
      ? "/silk-sarees"
      : product.category === "handloom-cotton"
        ? "/handloom-cotton"
        : "/semi-silk"

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
              {product.categoryLabel}
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
            Back to {product.categoryLabel}
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Product Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-xs tracking-[0.3em] text-accent">
                {product.categoryLabel.toUpperCase()}
              </span>
              <h1 className="mt-2 font-serif text-3xl text-foreground md:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-2xl font-semibold text-accent">
                {product.price}
              </p>

              <p className="mt-6 leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Product Details */}
              {product.details && (
                <div className="mt-8 space-y-4 border-t border-border pt-8">
                  <h2 className="font-serif text-lg text-foreground">
                    Product Details
                  </h2>
                  <dl className="space-y-3 text-sm">
                    {product.details.fabric && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Fabric
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.details.fabric}
                        </dd>
                      </div>
                    )}
                    {product.details.length && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Length
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.details.length}
                        </dd>
                      </div>
                    )}
                    {product.details.width && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Width
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.details.width}
                        </dd>
                      </div>
                    )}
                    {product.details.blouse && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Blouse
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.details.blouse}
                        </dd>
                      </div>
                    )}
                    {product.details.care && (
                      <div className="flex">
                        <dt className="w-24 flex-shrink-0 font-medium text-foreground">
                          Care
                        </dt>
                        <dd className="text-muted-foreground">
                          {product.details.care}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              {/* Add to Cart */}
              <ProductActions product={product} />
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
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-foreground">
                      {relatedProduct.name}
                    </h3>
                    <p className="mt-1 text-accent">{relatedProduct.price}</p>
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
