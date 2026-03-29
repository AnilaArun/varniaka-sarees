import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products"

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
              <div
                key={saree.id}
                className="group overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-[10px] tracking-wider text-primary-foreground">
                    SILK
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-foreground">
                    {saree.name}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-accent">
                    {saree.price}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {saree.description}
                  </p>
                  <Link
                    href={`/product/${saree.id}`}
                    className="mt-4 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </div>
              </div>
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
              <div
                key={saree.id}
                className="group overflow-hidden rounded-lg border border-border bg-background"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 bg-accent px-3 py-1 text-[10px] tracking-wider text-accent-foreground">
                    SEMI SILK
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-foreground">
                    {saree.name}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-accent">
                    {saree.price}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {saree.description}
                  </p>
                  <Link
                    href={`/product/${saree.id}`}
                    className="mt-4 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </div>
              </div>
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
              <div
                key={saree.id}
                className="group overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute left-3 top-3 bg-secondary px-3 py-1 text-[10px] tracking-wider text-secondary-foreground">
                    COTTON
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-lg text-foreground">
                    {saree.name}
                  </h3>
                  <p className="mt-1 text-lg font-medium text-accent">
                    {saree.price}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {saree.description}
                  </p>
                  <Link
                    href={`/product/${saree.id}`}
                    className="mt-4 block w-full rounded-md bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
