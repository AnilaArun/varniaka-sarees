import Image from "next/image"
import Link from "next/link"

const collections = [
  {
    title: "Silk Sarees",
    description: "Luxurious Banarasi & Kanjeevaram silks with intricate zari work",
    image: "/images/silk-saree.png",
    count: "48 Pieces",
  },
  {
    title: "Handloom Cotton",
    description: "Breathable handwoven cotton sarees with traditional block prints",
    image: "/images/cotton-saree.png",
    count: "36 Pieces",
  },
  {
    title: "Semi Silk",
    description: "Semi silk sarees adorned with zardozi and sequin embroidery",
    image: "/images/semi-silk-saree1.jpg",
    count: "24 Pieces",
  },
]

export function Collections() {
  return (
    <section id="collections" className="bg-background px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs tracking-[0.4em] text-muted-foreground">
            OUR COLLECTIONS
          </span>
          <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl lg:text-5xl">
            <span className="text-balance">Curated with Care</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Each collection tells a unique story of heritage, craftsmanship, and
            the timeless beauty of Indian textiles.
          </p>
        </div>

        {/* Collection Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {collections.map((col) => (
            <Link
              key={col.title}
              href="#"
              className="group relative overflow-hidden"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={col.image}
                  alt={col.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="text-[10px] tracking-[0.3em] text-accent/80">
                    {col.count}
                  </span>
                  <h3 className="mt-1 font-serif text-2xl text-primary-foreground">
                    {col.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
                    {col.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
