import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/admin/product-form"

export default async function NewProductPage() {
  const supabase = await createClient()

  const { data: collections } = await supabase
    .from("collections")
    .select("id, name")
    .order("name")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Add New Product</h1>
        <p className="mt-1 text-muted-foreground">
          Upload photos directly from your phone
        </p>
      </div>

      <ProductForm collections={collections || []} />
    </div>
  )
}
