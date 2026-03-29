import { CollectionForm } from "@/components/admin/collection-form"

export default function NewCollectionPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Add New Collection</h1>
        <p className="mt-1 text-muted-foreground">
          Create a new saree collection
        </p>
      </div>

      <CollectionForm />
    </div>
  )
}
