-- Add stock column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 1;

-- Create index for stock queries
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Update any NULL stock values to 1
UPDATE products SET stock = 1 WHERE stock IS NULL;
