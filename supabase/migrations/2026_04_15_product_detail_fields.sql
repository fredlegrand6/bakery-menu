-- Adds luxury detail fields to bakery_products for the product detail modal.
-- Run in Supabase SQL editor against the bakery-menu project.

ALTER TABLE bakery_products
  ADD COLUMN IF NOT EXISTS product_type TEXT
    CHECK (product_type IN ('Sativa', 'Indica', 'Hybrid')),
  ADD COLUMN IF NOT EXISTS origin TEXT,
  ADD COLUMN IF NOT EXISTS thc_percentage NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS cbd_percentage NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS tasting_notes TEXT[];
