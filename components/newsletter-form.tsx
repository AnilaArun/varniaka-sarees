"use client"

export function NewsletterForm() {
  return (
    <form
      className="flex w-full max-w-md gap-0"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="email"
        placeholder="Your email address"
        className="flex-1 border border-primary-foreground/20 bg-transparent px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="bg-accent px-6 py-3 text-sm tracking-wider text-accent-foreground transition-colors hover:bg-accent/90"
      >
        SUBSCRIBE
      </button>
    </form>
  )
}
