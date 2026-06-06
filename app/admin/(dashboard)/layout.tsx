import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-50 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/admin" className="font-serif text-xl font-bold">
            Varniaka Admin
          </Link>
          <AdminNav userEmail={user.email || ""} />
        </div>
      </header>
      <main className="p-4 pb-24 md:p-6">{children}</main>
    </div>
  )
}
