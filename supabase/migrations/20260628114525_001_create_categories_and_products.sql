/*
# Create categories and products tables

1. New Tables
- `categories`: Stores product categories with subcategories as JSON array
  - `id` (uuid, primary key)
  - `name` (text, unique, not null) - category name
  - `slug` (text, unique, not null) - URL-friendly identifier
  - `subcategories` (jsonb, default []) - array of subcategory strings
  - `sort_order` (int, default 0) - for ordering categories
  - `created_at` (timestamptz, default now())

- `products`: Stores product catalog
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `slug` (text, unique, not null) - URL-friendly identifier
  - `price` (int, not null) - price in PKR
  - `category_id` (uuid, references categories)
  - `subcategory` (text) - subcategory name within the category
  - `image` (text) - product image URL
  - `rating` (numeric(2,1), default 0) - 0-5 rating
  - `in_stock` (boolean, default true)
  - `featured` (boolean, default false)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on both tables
- Public read access for all users (anon + authenticated)
- Only authenticated users can write (for admin/cart operations)
3. Indexes
- slug indexes for fast lookups
- category_id index for filtering
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  subcategories jsonb NOT NULL DEFAULT '[]'::jsonb,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  price int NOT NULL CHECK (price >= 0),
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  subcategory text NOT NULL DEFAULT '',
  image text,
  rating numeric(2,1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  in_stock boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured) WHERE featured = true;

-- RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Categories: public read, authenticated write
DROP POLICY IF EXISTS "categories_select_public" ON categories;
CREATE POLICY "categories_select_public" ON categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "categories_insert_auth" ON categories;
CREATE POLICY "categories_insert_auth" ON categories FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "categories_update_auth" ON categories;
CREATE POLICY "categories_update_auth" ON categories FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "categories_delete_auth" ON categories;
CREATE POLICY "categories_delete_auth" ON categories FOR DELETE
TO authenticated USING (true);

-- Products: public read, authenticated write
DROP POLICY IF EXISTS "products_select_public" ON products;
CREATE POLICY "products_select_public" ON products FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "products_insert_auth" ON products;
CREATE POLICY "products_insert_auth" ON products FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "products_update_auth" ON products;
CREATE POLICY "products_update_auth" ON products FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "products_delete_auth" ON products;
CREATE POLICY "products_delete_auth" ON products FOR DELETE
TO authenticated USING (true);
