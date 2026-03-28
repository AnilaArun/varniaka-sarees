import { Quote } from "lucide-react"

const testimonials = [
  {
    text: "The Banarasi silk saree I received was absolutely breathtaking. The zari work was flawless and the fabric felt like a dream. Varnika truly delivers heirloom-quality pieces.",
    author: "Priya Sharma",
    location: "Mumbai",
  },
  {
    text: "I ordered my wedding saree from Varnika and it exceeded all expectations. The craftsmanship, the colors, the drape - everything was perfect. I felt like royalty on my special day.",
    author: "Ananya Reddy",
    location: "Hyderabad",
  },
  {
    text: "What sets Varnika apart is their commitment to authentic handloom. You can see and feel the difference. Every saree tells a story of the artisan who created it.",
    author: "Meera Iyer",
    location: "Chennai",
  },
]

export function Testimonials() {
  return (
    <section className="bg-primary px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <span className="text-xs tracking-[0.4em] text-accent/70">
            TESTIMONIALS
          </span>
          <h2 className="mt-4 font-serif text-3xl text-primary-foreground md:text-4xl lg:text-5xl">
            <span className="text-balance">Words from Our Patrons</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        {/*<div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="border border-primary-foreground/10 p-8"
            >
              <Quote className="h-8 w-8 text-accent/50" />
              <p className="mt-6 text-sm leading-relaxed text-primary-foreground/80">
                {t.text}
              </p>
              <div className="mt-8">
                <p className="font-serif text-lg text-primary-foreground">
                  {t.author}
                </p>
                <p className="mt-1 text-xs tracking-wider text-accent/70">
                  {t.location}
                </p>
              </div>
            </div>
          ))}
          </div>*/}
      </div>
    </section>
  )
}
