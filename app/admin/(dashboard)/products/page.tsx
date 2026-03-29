import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { DeleteProductButton } from "@/components/admin/delete-product-button"

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*, collections(name)")
    .order("created_at", { ascending: false })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your saree products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="overflow-hidden rounded-lg border bg-background"
            >
              <div className="relative aspect-square">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {product.collections?.name || "No collection"}
                </p>
                <p className="mt-1 font-medium">
                  £{(product.price_in_cents / 100).toFixed(2)}
                </p>
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-background p-12 text-center">
          <p className="text-muted-foreground">No products yet</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add your first product
          </Link>
        </div>
      )}
    </div>
  )
}
