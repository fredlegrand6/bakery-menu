import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { CategoryWithProducts, CategoryWithDrinks, BakeryEvent } from '@/lib/types';

export function useProducts() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bakery_categories')
      .select('*, bakery_products(*)')
      .eq('type', 'products')
      .eq('is_active', true)
      .order('display_order');

    if (data) {
      const filtered = data.map((cat) => ({
        ...cat,
        bakery_products: (cat.bakery_products as CategoryWithProducts['bakery_products'])
          .filter((p) => p.is_available)
          .sort((a, b) => a.display_order - b.display_order),
      })) as CategoryWithProducts[];
      setCategories(filtered);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { categories, loading, refetch: fetch };
}

export function useDrinks() {
  const [categories, setCategories] = useState<CategoryWithDrinks[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bakery_categories')
      .select('*, bakery_drinks(*)')
      .eq('type', 'drinks')
      .eq('is_active', true)
      .order('display_order');

    if (data) {
      const filtered = data.map((cat) => ({
        ...cat,
        bakery_drinks: (cat.bakery_drinks as CategoryWithDrinks['bakery_drinks'])
          .filter((d) => d.is_available)
          .sort((a, b) => a.display_order - b.display_order),
      })) as CategoryWithDrinks[];
      setCategories(filtered);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { categories, loading, refetch: fetch };
}

export function useSections() {
  const [sections, setSections] = useState<{ id: string; name: string; display_order: number }[]>([]);
  useEffect(() => {
    supabase.from('bakery_sections').select('*').order('display_order')
      .then(({ data }) => { if (data) setSections(data); });
  }, []);
  return { sections };
}

export function usePapiers() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bakery_categories')
      .select('*, bakery_products(*)')
      .eq('type', 'papiers')
      .eq('is_active', true)
      .order('display_order');

    if (data) {
      const filtered = data.map((cat) => ({
        ...cat,
        bakery_products: (cat.bakery_products as CategoryWithProducts['bakery_products'])
          .filter((p) => p.is_available)
          .sort((a, b) => a.display_order - b.display_order),
      })) as CategoryWithProducts[];
      setCategories(filtered);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { categories, loading, refetch: fetch };
}

export function useAttributes() {
  const [categories, setCategories] = useState<CategoryWithProducts[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bakery_categories')
      .select('*, bakery_products(*)')
      .eq('type', 'attributes')
      .eq('is_active', true)
      .order('display_order');

    if (data) {
      const filtered = data.map((cat) => ({
        ...cat,
        bakery_products: (cat.bakery_products as CategoryWithProducts['bakery_products'])
          .filter((p) => p.is_available)
          .sort((a, b) => a.display_order - b.display_order),
      })) as CategoryWithProducts[];
      setCategories(filtered);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { categories, loading, refetch: fetch };
}

export function useEvents() {
  const [events, setEvents] = useState<BakeryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('bakery_events')
      .select('*')
      .eq('is_active', true)
      .gte('event_date', today)
      .order('event_date');

    if (data) setEvents(data as BakeryEvent[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  return { events, loading, refetch: fetch };
}
