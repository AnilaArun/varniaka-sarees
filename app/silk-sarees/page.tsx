import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

const kanchipuramSarees = [
  {
    id: 1,
    name: "Pure Kanchipuram - Lavender Gold",
    price: "£130",
    image: "/images/kanchipuram-purple.jpg",
    description:
      "Exquisite pure Kanchipuram silk saree in a stunning lavender hue with rich red and gold zari border featuring traditional paisley and peacock motifs. Handwoven by master artisans for timeless elegance.",
  },
  {
    id: 2,
    name: "Pure Kanchipuram - Off White Red",
    price: "£180",
    image: "/images/kanchipuram-offwhite.jpg",
    description:
      "Elegant off-white Kanchipuram silk saree with delicate butta work and a magnificent red and gold zari border adorned with traditional elephant and floral motifs. A masterpiece of South Indian weaving.",
  },
]

export default function SilkSareesPage() {
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
            Silk Sarees
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/80 lg:text-lg">
            Discover our luxurious collection of pure Kanchipuram silk sarees.
            Each masterpiece is handwoven by skilled artisans using traditional
            techniques passed down through generations.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <span className="text-xs tracking-[0.4em] text-muted-foreground">
              PURE KANCHIPURAM
            </span>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
              Heritage Weaves
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Timeless elegance crafted with pure mulberry silk and authentic
              zari work.
            </p>
          </div>

          {/* Product Grid */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {kanchipuramSarees.map((saree) => (
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
