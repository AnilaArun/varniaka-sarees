-- Add optional named product images.
-- Existing image_url remains as the primary image for backwards compatibility.
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_images JSONB DEFAULT '{}'::jsonb;

-- Backfill the main image slot from existing image_url values.
UPDATE products
SET product_images = jsonb_build_object('main', image_url)
WHERE image_url IS NOT NULL
  AND image_url <> ''
  AND (product_images IS NULL OR product_images = '{}'::jsonb);

-- Refresh Supabase/PostgREST schema cache immediately.
NOTIFY pgrst, 'reload schema';
