export interface ProductVariant {
  label: string;
  price_cents: number;
}

export interface BakerySection {
  id: string;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  type: 'products' | 'drinks' | 'papiers' | 'attributes';
  display_order: number;
  is_active: boolean;
  section_id: string | null;
  created_at: string;
  updated_at: string;
}

export type ProductType = 'Sativa' | 'Indica' | 'Hybrid';

export interface Product {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  effects: string[] | null;
  image_url: string | null;
  video_url: string | null;
  variants: ProductVariant[];
  is_available: boolean;
  display_order: number;
  product_type: ProductType | null;
  origin: string | null;
  thc_percentage: number | null;
  cbd_percentage: number | null;
  tasting_notes: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Drink {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BakeryEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string | null;
  event_type: string | null;
  members_only: boolean;
  image_url: string | null;
  video_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithProducts extends Category {
  bakery_products: Product[];
}

export interface CategoryWithDrinks extends Category {
  bakery_drinks: Drink[];
}

export type EventType = 'sunset_session' | 'dj_night' | '420_special' | 'social' | 'full_moon' | 'special';