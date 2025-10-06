-- Add missing columns to customer_reviews table
ALTER TABLE public.customer_reviews 
ADD COLUMN IF NOT EXISTS customer_location TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;

-- Rename is_featured to featured for consistency
ALTER TABLE public.customer_reviews 
RENAME COLUMN is_featured TO featured;

-- Add missing slug column to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Generate slugs for existing categories (lowercase name with hyphens)
UPDATE public.categories 
SET slug = LOWER(REPLACE(name, ' ', '-'))
WHERE slug IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE public.categories 
ALTER COLUMN slug SET NOT NULL;

-- Add missing columns to portfolio_images for consistency
ALTER TABLE public.portfolio_images 
ADD COLUMN IF NOT EXISTS url TEXT;

-- Copy image_url to url for existing records
UPDATE public.portfolio_images 
SET url = image_url
WHERE url IS NULL;

-- Rename is_featured to featured for consistency
ALTER TABLE public.portfolio_images 
RENAME COLUMN is_featured TO featured;