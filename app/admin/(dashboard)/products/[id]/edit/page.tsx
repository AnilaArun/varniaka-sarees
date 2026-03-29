import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { ProductForm } from "@/components/admin/product-form"

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single()

  if (!product) {
    notFound()
  }

  const { data: collections } = await supabase
    .from("collections")
    .select("id, name")
    .order("name")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Edit Product</h1>
        <p className="mt-1 text-muted-foreground">Update product details</p>
      </div>

      <ProductForm collections={collections || []} initialData={product} />
    </div>
  )
}
