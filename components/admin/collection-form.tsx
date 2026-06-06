"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Camera, Upload, X, Loader2 } from "lucide-react"

interface CollectionFormProps {
  initialData?: {
    id: string
    name: string
    slug: string
    description: string
    image_url: string
  }
}

export function CollectionForm({ initialData }: CollectionFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    image_url: initialData?.image_url || "",
  })

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const getSaveErrorMessage = (err: unknown) => {
    if (
      err &&
      typeof err === "object" &&
      ("code" in err || "status" in err || "message" in err)
    ) {
      const error = err as { code?: string; status?: number; message?: string }

      if (
        error.code === "23505" ||
        error.status === 409 ||
        error.message?.toLowerCase().includes("duplicate key")
      ) {
        return `A collection with the slug "${formData.slug}" already exists. Change the URL Slug and save again.`
      }

      if (error.message) {
        return error.message
      }
    }

    return "Failed to save collection"
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `Upload failed with status ${response.status}`)
      }

      const { url } = await response.json()
      setFormData((prev) => ({ ...prev, image_url: url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const collectionData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        image_url: formData.image_url || null,
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from("collections")
          .update(collectionData)
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("collections").insert(collectionData)

        if (error) throw error
      }

      router.push("/admin/collections")
      router.refresh()
    } catch (err) {
      setError(getSaveErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Collection Image</label>
        <div className="flex flex-col items-center gap-4">
          {formData.image_url ? (
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border">
              <img
                src={formData.image_url}
                alt="Collection preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1 backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-video w-full max-w-md cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted"
            >
              {uploading ? (
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <Camera className="h-12 w-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Tap to add collection image
                  </span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          {!formData.image_url && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <Upload className="h-4 w-4" />
              Upload from gallery
            </button>
          )}
        </div>
      </div>

      {/* Collection Info */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Collection Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g., Silk Sarees"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium">
            URL Slug
          </label>
          <input
            id="slug"
            type="text"
            value={formData.slug}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, slug: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Describe this collection..."
          />
        </div>
      </div>

      <div className="flex gap-4 border-t pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-md border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.name}
          className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Collection" : "Create Collection"}
        </button>
      </div>
    </form>
  )
}
