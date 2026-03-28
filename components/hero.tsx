import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="grid lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[3/4] lg:aspect-auto lg:min-h-[85vh]">
          <Image
            src="/images/hero.jpg"
            alt="Beautiful woman wearing a traditional Indian silk saree with gold jewelry"
            fill
            className="object-cover object-top"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center bg-background px-8 py-16 text-center lg:items-start lg:px-16 lg:text-left">
          <span className="mb-4 text-xs tracking-[0.4em] text-muted-foreground">
            NEW COLLECTION 2026
          </span>
          <h1 className="font-serif text-4xl leading-tight text-foreground md:text-5xl lg:text-6xl">
            <span className="text-balance">Timeless Elegance,</span>
            <br />
            <span className="italic text-accent">Woven by Hand</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
            Discover our exquisite collection of handwoven sarees, crafted by
            master artisans preserving centuries-old traditions of Indian
            textile art.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="#collections"
              className="inline-flex items-center justify-center bg-primary px-8 py-3 text-sm tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
            >
              EXPLORE COLLECTIONS
            </Link>
            <Link
              href="#lookbook"
              className="inline-flex items-center justify-center border border-foreground px-8 py-3 text-sm tracking-wider text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              VIEW LOOKBOOK
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
