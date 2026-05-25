type SupabaseEnv = {
  url: string
  anonKey: string
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.",
    )
  }

  try {
    const parsedUrl = new URL(url)

    if (parsedUrl.pathname !== "/") {
      throw new Error()
    }
  } catch {
    throw new Error(
      "Invalid NEXT_PUBLIC_SUPABASE_URL. Use the Project URL from Supabase settings, for example https://your-project-ref.supabase.co.",
    )
  }

  return { url, anonKey }
}
