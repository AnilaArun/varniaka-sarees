import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getProductsByCategory } from "@/lib/products"

const semiSilkSarees = getProductsByCategory("semi-silk")

export default function SemiSilkPage() {
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
            Semi Silk Sarees
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
            Explore our exquisite collection of semi-silk sarees that combine
            the luxurious feel of silk with everyday wearability. Perfect for
            festive occasions and celebrations.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <span className="text-xs tracking-[0.4em] text-muted-foreground">
              SEMI SILK
            </span>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
              Festive Elegance
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Beautifully crafted semi-silk sarees with rich zari borders for
              that perfect blend of comfort and style.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {semiSilkSarees.map((saree) => (
              <article
                key={saree.id}
                className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-foreground">
                    {saree.name}
                  </h3>
                  <p className="mt-2 text-lg font-semibold text-accent">
                    {saree.price}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {saree.description}
                  </p>
                  <Link
                    href={`/product/${saree.id}`}
                    className="mt-4 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
