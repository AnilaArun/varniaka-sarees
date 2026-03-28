import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Collections } from "@/components/collections"
import { Featured } from "@/components/featured"
import { Story } from "@/components/story"
import { Testimonials } from "@/components/testimonials"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Collections />
      <Featured />
      <Story />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
