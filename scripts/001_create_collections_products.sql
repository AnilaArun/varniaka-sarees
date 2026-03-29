-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  price DECIMAL(10, 2) NOT NULL,
  price_in_cents INTEGER NOT NULL,
  description TEXT,
  image_url TEXT,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  fabric TEXT,
  length TEXT,
  width TEXT,
  blouse TEXT,
  care TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on collections" 
  ON collections FOR SELECT 
  USING (true);

CREATE POLICY "Allow public read access on products" 
  ON products FOR SELECT 
  USING (is_active = true);

-- Create policies for authenticated users (admin) to manage data
CREATE POLICY "Allow authenticated users to insert collections" 
  ON collections FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update collections" 
  ON collections FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete collections" 
  ON collections FOR DELETE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to insert products" 
  ON products FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update products" 
  ON products FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow authenticated users to delete products" 
  ON products FOR DELETE 
  TO authenticated 
  USING (true);

-- Allow authenticated users to read all products (including inactive)
CREATE POLICY "Allow authenticated users to read all products" 
  ON products FOR SELECT 
  TO authenticated 
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_collection_id ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_collections_slug ON collections(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
