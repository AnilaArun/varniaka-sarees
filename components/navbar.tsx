"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ShoppingBag } from "lucide-react"

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#collections", label: "Collections" },
  { href: "#lookbook", label: "Lookbook" },
  { href: "#story", label: "Our Story" },
  { href: "#contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/varnika-logo.jpeg"
            alt="Varnika logo"
            width={56}
            height={56}
            className="h-12 w-12 rounded-full object-cover lg:h-14 lg:w-14"
          />
          <div className="flex flex-col items-start">
            <span className="font-serif text-2xl italic tracking-wider text-accent lg:text-3xl">
              VARNIKA
            </span>
            <span className="text-[10px] tracking-[0.3em] text-accent/70 lg:text-xs">
              WOVEN FOR LIFE
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm tracking-wider text-primary-foreground/90 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Icons */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            aria-label="Shopping bag"
            className="text-primary-foreground/90 transition-colors hover:text-accent"
          >
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-foreground md:hidden"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="border-t border-primary-foreground/10 px-6 pb-6 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block py-3 text-sm tracking-wider text-primary-foreground/90 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
