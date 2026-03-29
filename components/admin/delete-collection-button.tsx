"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Loader2 } from "lucide-react"

interface DeleteCollectionButtonProps {
  collectionId: string
}

export function DeleteCollectionButton({ collectionId }: DeleteCollectionButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this collection? Products in this collection will not be deleted.")) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete collection")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center justify-center gap-2 rounded-md border border-destructive/50 px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  )
}
