import Link from "next/link"
import { Instagram, Facebook, Youtube } from "lucide-react"
import { NewsletterForm } from "@/components/newsletter-form"

const footerLinks = {
  collections: [
    { label: "Silk Sarees", href: "#" },
    { label: "Maheshwari Cotton", href: "/maheshwari-cotton" },
    { label: "Semi Silk", href: "#" },
  ],
  company: [
    { label: "Our Story", href: "#story" },
    { label: "Artisan Partners", href: "#" },
    { label: "Sustainability", href: "#" },
    { label: "Press", href: "#" },
    { label: "Careers", href: "#" },
  ],
  help: [
    { label: "Contact Us", href: "#contact" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Care Guide", href: "#" },
    { label: "Size Guide", href: "#" },
    { label: "FAQ", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer id="contact" className="bg-primary px-6 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="font-serif text-3xl italic tracking-wider text-accent">
                VARNIKA
              </span>
              <span className="mt-1 block text-[10px] tracking-[0.3em] text-accent/70">
                WOVEN FOR LIFE
              </span>
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Preserving the art of handwoven textiles, one saree at a time.
              From the looms of India to your wardrobe.
            </p>
            {/* Socials */}
            <div className="mt-6 flex gap-4">
              <a
                href="#"
                aria-label="Instagram"
                className="text-primary-foreground/50 transition-colors hover:text-accent"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="text-primary-foreground/50 transition-colors hover:text-accent"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="text-primary-foreground/50 transition-colors hover:text-accent"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-accent/70">
              COLLECTIONS
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.collections.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] text-accent/70">
              COMPANY
            </h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] text-accent/70">HELP</h4>
            <ul className="mt-4 flex flex-col gap-3">
              {footerLinks.help.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/60 transition-colors hover:text-primary-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-16 border-t border-primary-foreground/10 pt-10">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h4 className="font-serif text-lg text-primary-foreground">
                Stay Connected
              </h4>
              <p className="mt-1 text-sm text-primary-foreground/60">
                Subscribe for exclusive collections and artisan stories.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-primary-foreground/10 pt-6 text-center">
          <p className="text-xs text-primary-foreground/40">
            {"2026 Varnika. All rights reserved. Handcrafted with love in India."}
          </p>
        </div>
      </div>
    </footer>
  )
}
