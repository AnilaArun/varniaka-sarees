import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Pencil } from "lucide-react"
import { DeleteCollectionButton } from "@/components/admin/delete-collection-button"

export default async function AdminCollectionsPage() {
  const supabase = await createClient()

  const { data: collections } = await supabase
    .from("collections")
    .select("*, products(count)")
    .order("name", { ascending: true })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Collections</h1>
          <p className="mt-1 text-muted-foreground">
            Organize your sarees into collections
          </p>
        </div>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Collection
        </Link>
      </div>

      {collections && collections.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <div
              key={collection.id}
              className="overflow-hidden rounded-lg border bg-background"
            >
              <div className="relative aspect-video">
                {collection.image_url ? (
                  <img
                    src={collection.image_url}
                    alt={collection.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-medium">{collection.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {collection.products?.[0]?.count || 0} products
                </p>
                {collection.description && (
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {collection.description}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/admin/collections/${collection.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Link>
                  <DeleteCollectionButton collectionId={collection.id} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border bg-background p-12 text-center">
          <p className="text-muted-foreground">No collections yet</p>
          <Link
            href="/admin/collections/new"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Create your first collection
          </Link>
        </div>
      )}
    </div>
  )
}
