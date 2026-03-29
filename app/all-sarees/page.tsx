import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

export default function AllSareesPage() {
  const silkSarees = products.filter((p) => p.category === "silk")
  const semiSilkSarees = products.filter((p) => p.category === "semi-silk")
  const cottonSarees = products.filter((p) => p.category === "handloom-cotton")

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-card px-6 pb-12 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <span className="block text-xs tracking-[0.4em] text-muted-foreground">
            OUR COLLECTION
          </span>
          <h1 className="mt-4 font-serif text-4xl text-foreground md:text-5xl lg:text-6xl">
            <span className="text-balance">All Sarees</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Explore our complete collection of handcrafted sarees, from luxurious silks to comfortable cottons.
          </p>
        </div>
      </section>

      {/* Silk Sarees Section */}
      <section className="bg-background px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-foreground md:text-3xl">
                Silk Sarees
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Luxurious Kanchipuram silks with intricate zari work
              </p>
            </div>
            <Link
              href="/silk-sarees"
              className="text-sm text-accent hover:underline"
            >
              View All Silk
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {silkSarees.map((saree) => (
              <ProductCard
                key={saree.id}
                product={saree}
                badge="SILK"
                badgeClassName="bg-primary text-primary-foreground"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Semi Silk Sarees Section */}
      <section className="bg-card px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-foreground md:text-3xl">
                Semi Silk Sarees
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Perfect blend of silk and cotton for festive occasions
              </p>
            </div>
            <Link
              href="/semi-silk"
              className="text-sm text-accent hover:underline"
            >
              View All Semi Silk
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {semiSilkSarees.map((saree) => (
              <ProductCard
                key={saree.id}
                product={saree}
                badge="SEMI SILK"
                badgeClassName="bg-accent text-accent-foreground"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cotton Sarees Section */}
      <section className="bg-background px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-foreground md:text-3xl">
                Handloom Cotton Sarees
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Soft, breathable cottons for everyday elegance
              </p>
            </div>
            <Link
              href="/handloom-cotton"
              className="text-sm text-accent hover:underline"
            >
              View All Cotton
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cottonSarees.map((saree) => (
              <ProductCard
                key={saree.id}
                product={saree}
                badge="COTTON"
                badgeClassName="bg-secondary text-secondary-foreground"
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
