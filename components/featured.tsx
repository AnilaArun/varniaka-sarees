import Image from "next/image"
import Link from "next/link"

const products = [
  {
    name: "Royal Banarasi Silk",
    price: "12,500",
    image: "/images/featured-1.jpg",
    tag: "Bestseller",
  },
  {
    name: "Emerald Brocade Silk",
    price: "15,800",
    image: "/images/featured-2.jpg",
    tag: "New Arrival",
  },
  {
    name: "Blush Organza Floral",
    price: "9,200",
    image: "/images/featured-3.jpg",
    tag: null,
  },
  {
    name: "Golden Tussar Tribal",
    price: "11,000",
    image: "/images/featured-4.jpg",
    tag: "Limited Edition",
  },
]

export function Featured() {
  return (
    <section id="lookbook" className="bg-card px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs tracking-[0.4em] text-muted-foreground">
            LOOKBOOK
          </span>
          <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">
            <span className="text-balance">Featured Pieces</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Hand-picked sarees from our finest collections, each one a
            masterpiece of artisan craftsmanship.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link key={product.name} href="#" className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <span className="absolute left-3 top-3 bg-primary px-3 py-1 text-[10px] tracking-wider text-primary-foreground">
                  COMING SOON
                </span>
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-lg text-foreground transition-colors group-hover:text-accent">
                  {product.name}
                </h3>
                <p className="mt-1 text-sm italic text-muted-foreground">
                  Coming Soon
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="#"
            className="inline-flex items-center justify-center border border-foreground px-8 py-3 text-sm tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            VIEW ALL SAREES
          </Link>
        </div>
      </div>
    </section>
  )
}
