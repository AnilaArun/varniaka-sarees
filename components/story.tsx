import Image from "next/image"

const stats = [
  { value: "4+", label: "Years of Heritage" },
  { value: "50+", label: "Artisan Partners" },
  { value: "100%", label: "Authentic Weaves" },
  { value: "Pan India", label: "Sourced From" },
]

export function Story() {
  return (
    <section id="story" className="bg-background px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/about-weaving.jpg"
              alt="Master artisan hand-weaving a silk saree on a traditional wooden loom"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div>
            <span className="text-xs tracking-[0.4em] text-muted-foreground">
              OUR STORY
            </span>
            <h2 className="mt-4 font-serif text-3xl text-foreground md:text-4xl">
              <span className="text-balance">Born from a Love for Handwoven Craft</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
            Varnika was born from a passion for India's timeless textile heritage. We bring you an exquisite range of sarees - from luxurious pure Silk and elegant Semi Silk to breezy Cotton and the soft charm of Mul Cotton - each sourced directly from skilled weavers across the country.

Our mission is to connect you with authentic, handcrafted sarees while supporting artisan communities and preserving weaving traditions that have been perfected over centuries. At Varnika, every saree tells a story of devotion, artistry, and the rich cultural tapestry of India.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              We work directly with artisan families, ensuring fair wages and
              preserving weaving techniques passed down through generations. Each
              Varnika saree is not just a garment - it is a work of art that
              supports livelihoods and celebrates India{"'"}s rich textile
              heritage.
            </p>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className="font-serif text-3xl text-accent">
                    {stat.value}
                  </span>
                  <p className="mt-1 text-xs tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
