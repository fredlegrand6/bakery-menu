-- Bakery Menu Database Schema

-- Categories
CREATE TABLE bakery_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  video_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('products', 'drinks')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE bakery_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES bakery_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  effects TEXT[],
  image_url TEXT,
  variants JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Drinks
CREATE TABLE bakery_drinks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES bakery_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Events
CREATE TABLE bakery_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  event_time TEXT,
  event_type TEXT,
  members_only BOOLEAN NOT NULL DEFAULT false,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE bakery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE bakery_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bakery_drinks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bakery_events ENABLE ROW LEVEL SECURITY;

-- Public SELECT policies
CREATE POLICY "Public read categories" ON bakery_categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON bakery_products FOR SELECT USING (true);
CREATE POLICY "Public read drinks" ON bakery_drinks FOR SELECT USING (true);
CREATE POLICY "Public read events" ON bakery_events FOR SELECT USING (true);

-- Admin write policies
CREATE POLICY "Admin insert categories" ON bakery_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update categories" ON bakery_categories FOR UPDATE USING (true);
CREATE POLICY "Admin delete categories" ON bakery_categories FOR DELETE USING (true);
CREATE POLICY "Admin insert products" ON bakery_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update products" ON bakery_products FOR UPDATE USING (true);
CREATE POLICY "Admin delete products" ON bakery_products FOR DELETE USING (true);
CREATE POLICY "Admin insert drinks" ON bakery_drinks FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update drinks" ON bakery_drinks FOR UPDATE USING (true);
CREATE POLICY "Admin delete drinks" ON bakery_drinks FOR DELETE USING (true);
CREATE POLICY "Admin insert events" ON bakery_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update events" ON bakery_events FOR UPDATE USING (true);
CREATE POLICY "Admin delete events" ON bakery_events FOR DELETE USING (true);

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('bakery-menu-images', 'bakery-menu-images', true);

-- Storage policies
CREATE POLICY "Public read images" ON storage.objects FOR SELECT USING (bucket_id = 'bakery-menu-images');
CREATE POLICY "Allow insert images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'bakery-menu-images');
CREATE POLICY "Allow delete images" ON storage.objects FOR DELETE USING (bucket_id = 'bakery-menu-images');

-- Seed categories
INSERT INTO bakery_categories (name, description, type, display_order) VALUES
('Flower', 'Hand-selected, premium quality', 'products', 0),
('Hash & Concentrates', 'The finest extracts', 'products', 1),
('Pre-Rolls', 'Ready to go', 'products', 2),
('Cocktails & Spirits', 'Crafted for golden hour', 'drinks', 0),
('Soft Drinks & Juice', 'Fresh and cold', 'drinks', 1),
('Coffee & Tea', 'From noon till sunset', 'drinks', 2);

-- Seed products
INSERT INTO bakery_products (category_id, name, description, effects, variants, display_order)
SELECT id, 'OG Kush', 'Classic indica-dominant. Deep relaxation with earthy pine notes.',
ARRAY['Relaxing','Sleepy','Happy'],
'[{"label":"1g","price_cents":1200},{"label":"3.5g","price_cents":3800},{"label":"7g","price_cents":7000}]'::jsonb, 0
FROM bakery_categories WHERE name = 'Flower';

INSERT INTO bakery_products (category_id, name, description, effects, variants, display_order)
SELECT id, 'Amnesia Haze', 'Sativa powerhouse. Uplifting citrus with a creative kick.',
ARRAY['Energetic','Creative','Social'],
'[{"label":"1g","price_cents":1300},{"label":"3.5g","price_cents":4200}]'::jsonb, 1
FROM bakery_categories WHERE name = 'Flower';

INSERT INTO bakery_products (category_id, name, description, effects, variants, display_order)
SELECT id, 'Moroccan Gold', 'Traditional pressed hash. Warm, spicy, timeless.',
ARRAY['Relaxing','Social','Creative'],
'[{"label":"1g","price_cents":1000},{"label":"5g","price_cents":4500}]'::jsonb, 0
FROM bakery_categories WHERE name = 'Hash & Concentrates';

INSERT INTO bakery_products (category_id, name, description, effects, variants, display_order)
SELECT id, 'House Pre-Roll', 'Our daily blend. Perfectly rolled, ready for the terrace.',
ARRAY['Balanced','Social'],
'[{"label":"1 unit","price_cents":900},{"label":"3 pack","price_cents":2400}]'::jsonb, 0
FROM bakery_categories WHERE name = 'Pre-Rolls';

-- Seed drinks
INSERT INTO bakery_drinks (category_id, name, description, price_cents, display_order)
SELECT id, 'Aperol Spritz', 'House aperol, prosecco, orange', 900, 0
FROM bakery_categories WHERE name = 'Cocktails & Spirits';

INSERT INTO bakery_drinks (category_id, name, description, price_cents, display_order)
SELECT id, 'Gin & Tonic', 'Premium gin, tonic, lime', 1000, 1
FROM bakery_categories WHERE name = 'Cocktails & Spirits';

INSERT INTO bakery_drinks (category_id, name, description, price_cents, display_order)
SELECT id, 'Fresh Lemonade', 'Hand-squeezed, lightly sparkling', 500, 0
FROM bakery_categories WHERE name = 'Soft Drinks & Juice';

INSERT INTO bakery_drinks (category_id, name, description, price_cents, display_order)
SELECT id, 'Ibiza Coffee', 'Double espresso, oat milk, honey', 400, 0
FROM bakery_categories WHERE name = 'Coffee & Tea';

-- Seed events
INSERT INTO bakery_events (title, description, event_date, event_time, event_type, members_only, is_active) VALUES
('420 Sunset Session', 'Golden hour on the terrace. Curated sounds. Good company.', '2026-04-20', '16:20', '420_special', true, true),
('Full Moon Gathering', 'A night under the stars. Members only.', '2026-04-13', '21:00', 'full_moon', true, true),
('DJ Night: Balearic Beats', 'Local selectors spinning island sounds.', '2026-03-28', '22:00', 'dj_night', true, true),
('Members Mixer', 'New faces, old friends. Come as you are.', '2026-04-05', '19:00', 'social', true, true);
