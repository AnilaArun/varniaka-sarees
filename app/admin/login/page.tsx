"use client"

import { Suspense, useState, useMemo } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

// Check env vars at module level (these are replaced at build time for NEXT_PUBLIC_ vars)
const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function AdminLoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Check if Supabase is not configured (from middleware redirect or env vars)
  const supabaseConfigured = isSupabaseConfigured && searchParams.get('error') !== 'supabase_not_configured'
  
  // Only create client if configured - use useMemo to avoid recreating on every render
  const supabase = useMemo(() => {
    if (!supabaseConfigured) return null
    try {
      return createClient()
    } catch {
      return null
    }
  }, [supabaseConfigured])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    if (!supabase) {
      setError("Supabase is not configured. Please add your Supabase credentials.")
      setLoading(false)
      return
    }

    try {
      if (isForgotPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin/reset-password`,
        })

        if (error) {
          setError(error.message)
          return
        }

        setSuccess("Check your email for a password reset link.")
      } else if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        })

        if (error) {
          setError(error.message)
          return
        }

        setSuccess("Check your email for a confirmation link to complete your registration.")
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
          return
        }

        router.push("/admin")
        router.refresh()
      }
    } catch {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-3xl font-bold text-foreground">
            {isForgotPassword ? "Reset Password" : isSignUp ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isForgotPassword 
              ? "Enter your email to receive a password reset link"
              : isSignUp 
                ? "Create an account to manage your store" 
                : "Sign in to manage your Varniaka store"}
          </p>
        </div>

        {!supabaseConfigured && (
          <div className="rounded-md bg-amber-100 border border-amber-300 p-4 text-sm text-amber-800">
            <p className="font-medium">Supabase Not Configured</p>
            <p className="mt-1">To use the admin panel, you need to add your Supabase credentials:</p>
            <ol className="mt-2 list-decimal list-inside space-y-1">
              <li>Click the <strong>Settings</strong> button (top right)</li>
              <li>Go to <strong>Environment variables</strong> section</li>
              <li>Add these variables:
                <ul className="ml-5 mt-1 list-disc">
                  <li><code className="bg-amber-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
                  <li><code className="bg-amber-200 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
                </ul>
              </li>
            </ol>
            <p className="mt-2">
              Find these values in your{" "}
              <a 
                href="https://supabase.com/dashboard/project/_/settings/api" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                Supabase Dashboard
              </a>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </div>
          )}
          
          {success && (
            <div className="rounded-md bg-green-100 p-4 text-sm text-green-800">
              {success}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="admin@example.com"
              />
            </div>

            {!isForgotPassword && (
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading 
              ? (isForgotPassword ? "Sending..." : isSignUp ? "Creating account..." : "Signing in...") 
              : (isForgotPassword ? "Send Reset Link" : isSignUp ? "Create Account" : "Sign in")}
          </button>
        </form>
        
        <div className="space-y-2 text-center">
          {!isForgotPassword && !isSignUp && (
            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(true)
                setError(null)
                setSuccess(null)
              }}
              className="block w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Forgot your password?
            </button>
          )}
          
          <button
            type="button"
            onClick={() => {
              if (isForgotPassword) {
                setIsForgotPassword(false)
              } else {
                setIsSignUp(!isSignUp)
              }
              setError(null)
              setSuccess(null)
            }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            {isForgotPassword
              ? "Back to sign in"
              : isSignUp 
                ? "Already have an account? Sign in" 
                : "Need an account? Create one"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  )
}
