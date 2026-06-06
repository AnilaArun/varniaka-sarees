"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, ChevronDown, Search } from "lucide-react"
import { CartButton } from "@/components/cart-button"

type CollectionLink = {
  href: string
  label: string
}

const fallbackCollections: CollectionLink[] = [
  { href: "/silk-sarees", label: "Silk Sarees" },
  { href: "/semi-silk", label: "Semi Silk" },
  { href: "/banarasi", label: "Banarasi" },
  { href: "/maheshwari-cotton", label: "Maheshwari Cotton" },
  { href: "/kalyani-cotton", label: "Kalyani Cotton" },
  { href: "/mul-cotton", label: "Mul Cotton" },
  { href: "/linen", label: "Linen" },
  { href: "/organza", label: "Organza" },
  { href: "/kerala-sarees", label: "Kerala Sarees" },
]

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#lookbook", label: "Lookbook" },
  { href: "/#story", label: "Our Story" },
  { href: "/#contact", label: "Contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [collections, setCollections] = useState<CollectionLink[]>(fallbackCollections)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Filter collections based on search
  const filteredCollections = collections.filter((c) =>
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    let isMounted = true

    fetch("/api/collections")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { collections?: CollectionLink[] } | null) => {
        if (isMounted && data?.collections?.length) {
          setCollections(data.collections)
        }
      })
      .catch(() => {
        // Keep the static fallback links if the API is unavailable.
      })

    return () => {
      isMounted = false
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCollectionsOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

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
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm tracking-wider text-primary-foreground/90 transition-colors hover:text-accent"
          >
            Home
          </Link>

          {/* Collections Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCollectionsOpen(!collectionsOpen)}
              className="flex items-center gap-1 text-sm tracking-wider text-primary-foreground/90 transition-colors hover:text-accent"
            >
              Collections
              <ChevronDown className={`h-4 w-4 transition-transform ${collectionsOpen ? "rotate-180" : ""}`} />
            </button>

            {collectionsOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-md border border-border bg-background py-2 shadow-lg">
                {collections.map((collection) => (
                  <Link
                    key={collection.href}
                    href={collection.href}
                    onClick={() => setCollectionsOpen(false)}
                    className="block px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-accent"
                  >
                    {collection.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {navLinks.slice(1).map((link) => (
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
          {/* Search */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-primary-foreground/90 transition-colors hover:text-accent"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-md border border-border bg-background p-3 shadow-lg">
                <input
                  type="text"
                  placeholder="Search collections or product code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <div className="mt-2 max-h-64 overflow-y-auto">
                    {filteredCollections.length > 0 ? (
                      <>
                        <p className="px-2 py-1 text-xs font-medium text-muted-foreground">Collections</p>
                        {filteredCollections.map((collection) => (
                          <Link
                            key={collection.href}
                            href={collection.href}
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery("")
                            }}
                            className="block rounded-md px-2 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                          >
                            {collection.label}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <p className="px-2 py-2 text-sm text-muted-foreground">
                        No collections found. Try searching by product code.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <CartButton />
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
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block py-3 text-sm tracking-wider text-primary-foreground/90 transition-colors hover:text-accent"
          >
            Home
          </Link>

          {/* Mobile Search */}
          <div className="py-3">
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-accent focus:outline-none"
            />
          </div>

          {/* Mobile Collections */}
          <div className="py-2">
            <p className="py-2 text-xs font-medium tracking-wider text-primary-foreground/60">
              COLLECTIONS
            </p>
            {(searchQuery ? filteredCollections : collections).map((collection) => (
              <Link
                key={collection.href}
                href={collection.href}
                onClick={() => {
                  setIsOpen(false)
                  setSearchQuery("")
                }}
                className="block py-2 pl-2 text-sm tracking-wider text-primary-foreground/90 transition-colors hover:text-accent"
              >
                {collection.label}
              </Link>
            ))}
          </div>

          {navLinks.slice(1).map((link) => (
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
