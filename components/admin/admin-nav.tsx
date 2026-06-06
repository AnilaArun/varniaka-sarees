"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Package, FolderOpen, Plus, LogOut, Home } from "lucide-react"

interface AdminNavProps {
  userEmail: string
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: Home },
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/collections", label: "Collections", icon: FolderOpen },
    { href: "/admin/products/new", label: "Add Product", icon: Plus },
  ]

  return (
    <div className="flex items-center gap-4">
      <nav className="hidden items-center gap-1 md:flex">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t bg-background px-2 py-2 shadow-lg md:hidden">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-md px-2 text-[11px] font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-center leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="flex items-center gap-3 border-l pl-4">
        <span className="hidden text-sm text-muted-foreground md:block">
          {userEmail}
        </span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sign out</span>
        </button>
      </div>
    </div>
  )
}
