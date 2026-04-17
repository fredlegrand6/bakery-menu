-- Follow-up to 2026_04_15_product_detail_fields.sql
-- Ensures all rich product fields exist (idempotent) and reloads PostgREST cache
-- so the new admin form fields appear in the API immediately.

ALTER TABLE bakery_products
  ADD COLUMN IF NOT EXISTS product_type TEXT,
  ADD COLUMN IF NOT EXISTS origin TEXT,
  ADD COLUMN IF NOT EXISTS thc_percentage NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS cbd_percentage NUMERIC(5, 2),
  ADD COLUMN IF NOT EXISTS tasting_notes TEXT[];

ALTER TABLE bakery_products
  DROP CONSTRAINT IF EXISTS bakery_products_product_type_check;

ALTER TABLE bakery_products
  ADD CONSTRAINT bakery_products_product_type_check
  CHECK (product_type IS NULL OR product_type IN ('Sativa', 'Indica', 'Hybrid'));

NOTIFY pgrst, 'reload schema';
