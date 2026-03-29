import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CollectionForm } from "@/components/admin/collection-form"

interface EditCollectionPageProps {
  params: Promise<{ id: string }>
}

export default async function EditCollectionPage({ params }: EditCollectionPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .single()

  if (!collection) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Edit Collection</h1>
        <p className="mt-1 text-muted-foreground">Update collection details</p>
      </div>

      <CollectionForm initialData={collection} />
    </div>
  )
}
