import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("collections")
    .select("name, slug, products(count)")
    .order("name", { ascending: true })

  if (error) {
    return NextResponse.json({ collections: [] }, { status: 500 })
  }

  return NextResponse.json({
    collections: (data || [])
      .filter((collection) => (collection.products?.[0]?.count || 0) > 0)
      .map((collection) => ({
        href: `/collections/${collection.slug}`,
        label: collection.name,
      })),
  })
}
