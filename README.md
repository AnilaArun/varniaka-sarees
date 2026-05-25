# varniaka-sarees

## Local setup

Create `.env.local` from `.env.example` and fill in the values for the services you use:

```bash
cp .env.example .env.local
```

The contact form requires `RESEND_API_KEY`. Without it, the API returns a clear setup error instead of failing with an unclear Resend error.
Admin image uploads require `BLOB_READ_WRITE_TOKEN`. Vercel adds this automatically when a Blob store is connected to the same project.

Required environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
RESEND_API_KEY=
BLOB_READ_WRITE_TOKEN=
```
