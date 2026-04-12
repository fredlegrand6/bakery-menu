import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Product, Drink, BakeryEvent, BakerySection, CategoryWithProducts, CategoryWithDrinks } from '@/lib/types';

export function useAdminCategories(type: 'products' | 'drinks' | 'papiers' | 'attributes') {
  const [categories, setCategories] = useState<(CategoryWithProducts | CategoryWithDrinks)[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const relation = type === 'drinks' ? 'bakery_drinks' : 'bakery_products';
    const { data } = await supabase
      .from('bakery_categories')
      .select(`*, ${relation}(*)`)
      .eq('type', type)
      .order('display_order');

    console.log('[useAdminCategories] raw data for type', type, ':', data);

    if (data) {
      const sorted = data.map((cat: Record<string, unknown>) => ({
        ...cat,
        [relation]: ((cat[relation] as Array<Product | Drink>) || []).sort(
          (a: Product | Drink, b: Product | Drink) => a.display_order - b.display_order
        ),
      }));
      setCategories(sorted as unknown as (CategoryWithProducts | CategoryWithDrinks)[]);
    }
    setLoading(false);
  }, [type]);

  useEffect(() => { fetch(); }, [fetch]);

  const addCategory = async (data: { name: string; description: string; image_url?: string | null; video_url?: string | null; section_id?: string | null }) => {
    const maxOrder = categories.length > 0
      ? Math.max(...categories.map((c) => c.display_order))
      : -1;
    const { error } = await supabase.from('bakery_categories').insert({
      name: data.name,
      description: data.description || null,
      image_url: data.image_url ?? null,
      video_url: data.video_url ?? null,
      section_id: data.section_id ?? null,
      type,
      display_order: maxOrder + 1,
      is_active: true,
    });
    if (error) throw new Error(error.message);
    await fetch();
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    const { error } = await supabase.from('bakery_categories').update(updates).eq('id', id);
    if (error) throw new Error(error.message);
    await fetch();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from('bakery_categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await fetch();
  };

  const reorderCategories = async (orderedIds: string[]) => {
    setCategories((prev) => {
      const map = new Map(prev.map((c) => [c.id, c]));
      return orderedIds.map((id, idx) => ({ ...map.get(id)!, display_order: idx }));
    });
    await Promise.all(
      orderedIds.map((id, idx) =>
        supabase.from('bakery_categories').update({ display_order: idx }).eq('id', id)
      )
    );
  };

  return { categories, loading, refetch: fetch, addCategory, updateCategory, deleteCategory, reorderCategories };
}

export function useAdminProducts() {
  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('bakery_products').insert(product);
    if (error) throw new Error(error.message);
  };
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const { error } = await supabase.from('bakery_products').update(updates).eq('id', id);
    if (error) throw new Error(error.message);
  };
  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from('bakery_products').delete().eq('id', id);
    if (error) throw new Error(error.message);
  };
  const reorderProducts = async (orderedIds: string[]) => {
    await Promise.all(
      orderedIds.map((id, idx) =>
        supabase.from('bakery_products').update({ display_order: idx }).eq('id', id)
      )
    );
  };
  return { addProduct, updateProduct, deleteProduct, reorderProducts };
}

export function useAdminDrinks() {
  const addDrink = async (drink: Omit<Drink, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('bakery_drinks').insert(drink);
    if (error) throw new Error(error.message);
  };
  const updateDrink = async (id: string, updates: Partial<Drink>) => {
    const { error } = await supabase.from('bakery_drinks').update(updates).eq('id', id);
    if (error) throw new Error(error.message);
  };
  const deleteDrink = async (id: string) => {
    const { error } = await supabase.from('bakery_drinks').delete().eq('id', id);
    if (error) throw new Error(error.message);
  };
  const reorderDrinks = async (orderedIds: string[]) => {
    await Promise.all(
      orderedIds.map((id, idx) =>
        supabase.from('bakery_drinks').update({ display_order: idx }).eq('id', id)
      )
    );
  };
  return { addDrink, updateDrink, deleteDrink, reorderDrinks };
}

export function useAdminEvents() {
  const [events, setEvents] = useState<BakeryEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bakery_events')
      .select('*')
      .order('event_date', { ascending: false });
    if (data) setEvents(data as BakeryEvent[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const addEvent = async (event: Omit<BakeryEvent, 'id' | 'created_at' | 'updated_at'>) => {
    const { error } = await supabase.from('bakery_events').insert(event);
    if (error) throw new Error(error.message);
    await fetch();
  };
  const updateEvent = async (id: string, updates: Partial<BakeryEvent>) => {
    const { error } = await supabase.from('bakery_events').update(updates).eq('id', id);
    if (error) throw new Error(error.message);
    await fetch();
  };
  const deleteEvent = async (id: string) => {
    const { error } = await supabase.from('bakery_events').delete().eq('id', id);
    if (error) throw new Error(error.message);
    await fetch();
  };

  return { events, loading, refetch: fetch, addEvent, updateEvent, deleteEvent };
}

export function useSections() {
  const [sections, setSections] = useState<BakerySection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bakery_sections')
      .select('*')
      .order('display_order');
    if (data) setSections(data as BakerySection[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  const addSection = async (name: string) => {
    const maxOrder = sections.length > 0
      ? Math.max(...sections.map((s) => s.display_order)) : -1;
    const { error } = await supabase
      .from('bakery_sections')
      .insert({ name, display_order: maxOrder + 1 });
    if (error) throw new Error(error.message);
    await fetchSections();
  };

  const updateSection = async (id: string, name: string) => {
    const { error } = await supabase
      .from('bakery_sections')
      .update({ name })
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchSections();
  };

  const deleteSection = async (id: string) => {
    const { error } = await supabase
      .from('bakery_sections')
      .delete()
      .eq('id', id);
    if (error) throw new Error(error.message);
    await fetchSections();
  };

  return { sections, loading, refetch: fetchSections, addSection, updateSection, deleteSection };
}
