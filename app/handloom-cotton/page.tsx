import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const kalyaniCottonSarees = [
  {
    id: 1,
    name: "Kalyani Cotton - Pink Navy",
    price: "£20",
    image: "/images/kalyani-cotton-2.jpg",
    description:
      "Soft, lightweight, and breathable Kalyani cotton fabric designed for everyday elegance. Comfortable to wear with a smooth finish and classic appeal.",
  },
  {
    id: 2,
    name: "Kalyani Cotton - Mustard Purple",
    price: "£20",
    image: "/images/kalyani-cotton-3.jpg",
    description:
      "Soft, lightweight, and breathable Kalyani cotton fabric designed for everyday elegance. Comfortable to wear with a smooth finish and classic appeal.",
  },
]

export default function HandloomCottonPage() {
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
            Discover our exquisite collection of Kalyani cotton sarees.
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
              KALYANI COTTON
            </span>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
              Everyday Elegance
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Soft, lightweight, and breathable - perfect for all occasions.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {kalyaniCottonSarees.map((saree) => (
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
                  <button className="mt-4 w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                    View Details
                  </button>
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
