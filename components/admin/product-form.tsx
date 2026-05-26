"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Camera, Upload, X, Loader2, Plus, Trash2 } from "lucide-react"

interface Collection {
  id: string
  name: string
}

interface ProductFormProps {
  collections: Collection[]
  initialData?: {
    id: string
    name: string
    slug: string
    price: number
    price_in_cents: number
    description: string
    image_url: string
    collection_id: string | null
    fabric: string | null
    length: string | null
    width: string | null
    blouse: string | null
    care: string | null
    stock: number | null
  }
}

export function ProductForm({ collections, initialData }: ProductFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    price: initialData?.price?.toString() || "",
    description: initialData?.description || "Elegant handcrafted saree with traditional designs and premium quality fabric.",
    image_url: initialData?.image_url || "",
    collection_id: initialData?.collection_id || "",
    fabric: initialData?.fabric || "",
    length: initialData?.length || "5.5 meters",
    width: initialData?.width || "1.1 meters",
    blouse: initialData?.blouse || "Running blouse piece included (unstitched)",
    care: initialData?.care || "Dry clean recommended",
    stock: initialData?.stock?.toString() || "1",
  })

  // Auto-fill fabric when collection changes
  useEffect(() => {
    if (formData.collection_id && !initialData?.fabric) {
      const selectedCollection = collections.find(c => c.id === formData.collection_id)
      if (selectedCollection) {
        setFormData(prev => ({ ...prev, fabric: selectedCollection.name }))
      }
    }
  }, [formData.collection_id, collections, initialData?.fabric])

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  // Compress image before upload for better performance
  const compressImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.crossOrigin = "anonymous"
      const objectUrl = URL.createObjectURL(file)
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl)
        const canvas = document.createElement("canvas")
        let width = img.width
        let height = img.height

        // Scale down if larger than maxWidth
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Could not get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error("Failed to compress image"))
            }
          },
          "image/jpeg",
          quality
        )
      }

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error("Failed to load image"))
      }
      img.src = objectUrl
    })
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
        return `A product with the slug "${formData.slug}" already exists. Change the URL Slug and save again.`
      }

      if (error.message) {
        return error.message
      }
    }

    return "Failed to save product"
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const [uploadProgress, setUploadProgress] = useState(0)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setUploadProgress(10)
    setError(null)

    try {
      // Compress image first (much faster upload)
      setUploadProgress(20)
      const compressedBlob = await compressImage(file, 1200, 0.85)
      setUploadProgress(50)
      
      // Create a new file from the compressed blob
      const compressedFile = new File(
        [compressedBlob], 
        file.name.replace(/\.[^/.]+$/, ".jpg"), 
        { type: "image/jpeg" }
      )

      const formDataUpload = new FormData()
      formDataUpload.append("file", compressedFile)

      setUploadProgress(60)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      setUploadProgress(90)

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || `Upload failed with status ${response.status}`)
      }

      const { url } = await response.json()
      setFormData((prev) => ({ ...prev, image_url: url }))
      setUploadProgress(100)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const priceInCents = Math.round(parseFloat(formData.price) * 100)

      const productData = {
        name: formData.name,
        slug: formData.slug,
        price: parseFloat(formData.price),
        price_in_cents: priceInCents,
        description: formData.description,
        image_url: formData.image_url,
        collection_id: formData.collection_id || null,
        fabric: formData.fabric || null,
        length: formData.length || null,
        width: formData.width || null,
        blouse: formData.blouse || null,
        care: formData.care || null,
        stock: parseInt(formData.stock) || 0,
      }

      if (initialData?.id) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", initialData.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("products").insert(productData)

        if (error) throw error
      }

      router.push("/admin/products")
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

      {/* Image Upload - Mobile Optimized */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">Product Image</label>
        <div className="flex flex-col items-center gap-4">
          {formData.image_url ? (
            <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-lg border">
              <img
                src={formData.image_url}
                alt="Product preview"
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
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`flex aspect-square w-full max-w-xs flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed bg-muted/50 transition-colors ${
                uploading 
                  ? "border-primary/50 cursor-wait" 
                  : "border-muted-foreground/25 cursor-pointer hover:border-primary/50 hover:bg-muted"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <div className="w-32">
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div 
                        className="h-2 rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="mt-2 text-center text-xs text-muted-foreground">
                      {uploadProgress < 50 ? "Compressing..." : "Uploading..."}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <Camera className="h-12 w-12 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Tap to take or select photo
                  </span>
                </>
              )}
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
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

      {/* Basic Info */}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Product Name *
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g., Pure Kanchipuram Silk - Red Gold"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Price (£) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              required
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="0.00"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium">
              Stock Quantity *
            </label>
            <select
              id="stock"
              required
              value={formData.stock}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, stock: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="0">0 - Out of Stock</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="collection" className="block text-sm font-medium">
              Collection
            </label>
            <select
              id="collection"
              value={formData.collection_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, collection_id: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select collection</option>
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>
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
            placeholder="Describe the saree..."
          />
        </div>
      </div>

      {/* Product Details */}
      <div className="space-y-4 border-t pt-6">
        <h3 className="font-medium">Product Specifications</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fabric" className="block text-sm font-medium">
              Fabric
            </label>
            <input
              id="fabric"
              type="text"
              value={formData.fabric}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, fabric: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Auto-filled from collection"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Auto-fills when you select a collection
            </p>
          </div>

          <div>
            <label htmlFor="length" className="block text-sm font-medium">
              Length
            </label>
            <input
              id="length"
              type="text"
              value={formData.length}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, length: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., 5.5 meters"
            />
          </div>

          <div>
            <label htmlFor="width" className="block text-sm font-medium">
              Width
            </label>
            <input
              id="width"
              type="text"
              value={formData.width}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, width: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., 1.1 meters"
            />
          </div>

          <div>
            <label htmlFor="blouse" className="block text-sm font-medium">
              Blouse Piece
            </label>
            <input
              id="blouse"
              type="text"
              value={formData.blouse}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, blouse: e.target.value }))
              }
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="e.g., Running blouse piece included"
            />
          </div>
        </div>

        <div>
          <label htmlFor="care" className="block text-sm font-medium">
            Care Instructions
          </label>
          <input
            id="care"
            type="text"
            value={formData.care}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, care: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g., Dry clean recommended"
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
          disabled={loading || !formData.name || !formData.price}
          className="flex-1 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "Saving..." : initialData ? "Update Product" : "Add Product"}
        </button>
      </div>
    </form>
  )
}
