import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Package, FolderOpen, Plus } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })

  const { count: collectionCount } = await supabase
    .from("collections")
    .select("*", { count: "exact", head: true })

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Manage your Varniaka saree store
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-background p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold">{productCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-primary/10 p-3">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Collections</p>
              <p className="text-2xl font-bold">{collectionCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <Link
            href="/admin/products/new"
            className="flex items-center gap-4 transition-opacity hover:opacity-80"
          >
            <div className="rounded-full bg-accent/20 p-3">
              <Plus className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="font-medium">Add New Product</p>
              <p className="text-sm text-muted-foreground">
                Upload photos from your phone
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="flex items-center gap-4 rounded-lg border bg-background p-6 transition-colors hover:bg-muted/50"
        >
          <Package className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">Manage Products</h3>
            <p className="text-sm text-muted-foreground">
              View, edit, and delete products
            </p>
          </div>
        </Link>

        <Link
          href="/admin/collections"
          className="flex items-center gap-4 rounded-lg border bg-background p-6 transition-colors hover:bg-muted/50"
        >
          <FolderOpen className="h-8 w-8 text-primary" />
          <div>
            <h3 className="font-medium">Manage Collections</h3>
            <p className="text-sm text-muted-foreground">
              Create and organize saree collections
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
