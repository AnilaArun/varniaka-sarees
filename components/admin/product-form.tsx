"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Camera, Upload, X, Loader2, Plus, Trash2 } from "lucide-react"

interface Collection {
  id: string
  name: string
}

interface ProductDetail {
  label: string
  value: string
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
    product_details?: ProductDetail[]
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

  const [productDetails, setProductDetails] = useState<ProductDetail[]>(
    initialData?.product_details && initialData.product_details.length > 0
      ? initialData.product_details
      : [
          { label: "Saree", value: "" },
          { label: "Pallu", value: "" },
          { label: "Blouse", value: "Running blouse piece included" },
        ]
  )

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
        const data = await response.json()
        throw new Error(data.error || "Upload failed")
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
      const priceInCents = Math.round(parseFloat(formData.price) * 100)

      // Filter out empty product details
      const filteredDetails = productDetails.filter(d => d.label.trim() && d.value.trim())

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
        product_details: filteredDetails,
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
      setError(err instanceof Error ? err.message : "Failed to save product")
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
              onClick={() => fileInputRef.current?.click()}
              className="flex aspect-square w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-primary/50 hover:bg-muted"
            >
              {uploading ? (
                <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
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

      {/* Additional Product Details - Dynamic Array */}
      <div className="space-y-4 border-t pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Additional Details (Saree, Pallu, Blouse, etc.)</h3>
          <button
            type="button"
            onClick={() => setProductDetails([...productDetails, { label: "", value: "" }])}
            className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm transition-colors hover:bg-muted"
          >
            <Plus className="h-4 w-4" />
            Add Detail
          </button>
        </div>

        <div className="space-y-3">
          {productDetails.map((detail, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="w-1/3">
                <input
                  type="text"
                  value={detail.label}
                  onChange={(e) => {
                    const updated = [...productDetails]
                    updated[index].label = e.target.value
                    setProductDetails(updated)
                  }}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Label (e.g., Saree)"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={detail.value}
                  onChange={(e) => {
                    const updated = [...productDetails]
                    updated[index].value = e.target.value
                    setProductDetails(updated)
                  }}
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Value (e.g., Soft texture with zari work)"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const updated = productDetails.filter((_, i) => i !== index)
                  setProductDetails(updated)
                }}
                className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Add details for Saree body, Pallu design, Blouse piece, Border style, etc.
        </p>
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
