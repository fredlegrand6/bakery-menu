import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAdminCategories, useAdminProducts } from '@/hooks/useAdminData';
import { formatPrice, cn } from '@/lib/utils';
import CategoryModal from './CategoryModal';
import ProductModal from './ProductModal';
import type { Category, Product, CategoryWithProducts } from '@/lib/types';

function SortableCategoryCard({ cat, children }: { cat: CategoryWithProducts; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 50 : undefined };
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div {...attributes} {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing text-sage/30 hover:text-sage/60 p-2">
        <GripVertical size={16} />
      </div>
      {children}
    </div>
  );
}

function SortableProductRow({ product, children }: { product: Product; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1, zIndex: isDragging ? 50 : undefined };
  return (
    <div ref={setNodeRef} style={style}>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-sage/[0.08] border-l-2 border-l-sage/20 hover:bg-white/[0.04] transition-colors duration-200">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical size={14} className="text-sage/30 shrink-0 hover:text-sage/60 transition-colors" />
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminAttributesTab({ onCategoryChange }: { onCategoryChange?: () => void }) {
  const { categories, refetch, addCategory, updateCategory, deleteCategory, reorderCategories } = useAdminCategories('attributes');
  const { addProduct, updateProduct, deleteProduct, reorderProducts } = useAdminProducts();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catModal, setCatModal] = useState<{ open: boolean; editing: Category | null }>({ open: false, editing: null });
  const [prodModal, setProdModal] = useState<{ open: boolean; editing: Product | null; categoryId: string; nextOrder: number }>({
    open: false, editing: null, categoryId: '', nextOrder: 0,
  });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const cats = categories as CategoryWithProducts[];

  const handleCatDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cats.findIndex((c) => c.id === active.id);
    const newIndex = cats.findIndex((c) => c.id === over.id);
    reorderCategories(arrayMove(cats, oldIndex, newIndex).map((c) => c.id));
  };

  const handleProductDragEnd = (catId: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const cat = cats.find((c) => c.id === catId);
    if (!cat) return;
    const items = cat.bakery_products || [];
    const oldIndex = items.findIndex((p) => p.id === active.id);
    const newIndex = items.findIndex((p) => p.id === over.id);
    reorderProducts(arrayMove(items, oldIndex, newIndex).map((p) => p.id)).then(refetch);
  };

  const handleSaveCategory = async (data: { name: string; description: string; image_url: string | null; video_url: string | null; section_id: string | null }) => {
    if (catModal.editing) {
      await updateCategory(catModal.editing.id, { name: data.name, description: data.description || null, image_url: data.image_url, video_url: data.video_url, section_id: data.section_id });
    } else {
      await addCategory(data);
    }
    onCategoryChange?.();
  };

  const handleSaveProduct = async (data: Parameters<typeof addProduct>[0]) => {
    try {
      if (prodModal.editing) { await updateProduct(prodModal.editing.id, data); }
      else { await addProduct(data); }
      await refetch();
    } catch (err) { alert((err as Error).message); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    try { await deleteProduct(id); await refetch(); }
    catch (err) { alert((err as Error).message); }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category and all its items?')) return;
    await deleteCategory(id);
    onCategoryChange?.();
  };

  const renderCategoryCard = (cat: CategoryWithProducts) => {
    const isOpen = expandedId === cat.id;
    const items = cat.bakery_products || [];
    return (
      <SortableCategoryCard key={cat.id} cat={cat}>
        <div className={cn('rounded-2xl border border-sage/[0.08] bg-black/20 overflow-hidden transition-all duration-200 ml-6', isOpen && 'border-l-2 border-l-terracotta/30')}>
          <button onClick={() => setExpandedId(isOpen ? null : cat.id)} className="w-full flex items-center gap-3 p-6 text-left">
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-sage/50" />
            </motion.div>
            {cat.image_url && <img src={cat.image_url} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />}
            <div className="flex-1 min-w-0">
              <span className="font-display text-xl text-cream font-medium">{cat.name}</span>
              <span className={cn('ml-2 text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full', cat.is_active ? 'bg-sage/20 text-sage' : 'bg-sage/10 text-sage/40')}>
                {cat.is_active ? 'Active' : 'Hidden'}
              </span>
            </div>
            <span className="bg-sage/10 text-sage text-sm px-2.5 py-0.5 rounded-full">{items.length} items</span>
          </button>
          <AnimatePresence>
            {isOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="px-5 pb-5 space-y-2 border-t border-sage/[0.08] pt-4">
                  <div className="flex gap-2 mb-3">
                    <button onClick={() => updateCategory(cat.id, { is_active: !cat.is_active })} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-sage/50 hover:bg-white/10 hover:text-cream transition-colors duration-300">
                      {cat.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => setCatModal({ open: true, editing: cat })} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-sage/50 hover:bg-white/10 hover:text-cream transition-colors duration-300">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/5 text-red-400/70 hover:bg-red-900/20 hover:text-red-400 transition-colors duration-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleProductDragEnd(cat.id)}>
                    <SortableContext items={items.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                      {items.map((product) => (
                        <SortableProductRow key={product.id} product={product}>
                          {product.image_url && <img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                          <div className="flex-1 min-w-0">
                            <p className="text-base text-cream font-medium truncate">{product.name}</p>
                            <p className="text-xs text-sage/40">
                              {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                              {product.variants.length > 0 && ` · from ${formatPrice(Math.min(...product.variants.map((v) => v.price_cents)))}`}
                            </p>
                          </div>
                          <button onClick={() => updateProduct(product.id, { is_available: !product.is_available }).then(refetch)} className={cn('text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors duration-300', product.is_available ? 'bg-sage/15 text-sage' : 'bg-white/5 text-sage/30')}>
                            {product.is_available ? 'Live' : 'Off'}
                          </button>
                          <button onClick={() => setProdModal({ open: true, editing: product, categoryId: cat.id, nextOrder: 0 })} className="text-sage/30 hover:text-cream transition-colors duration-300">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-sage/30 hover:text-red-400 transition-colors duration-300">
                            <Trash2 size={14} />
                          </button>
                        </SortableProductRow>
                      ))}
                    </SortableContext>
                  </DndContext>
                  <button onClick={() => setProdModal({ open: true, editing: null, categoryId: cat.id, nextOrder: items.length })} className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-sage/15 text-sage/35 hover:text-sage hover:border-sage/30 text-base transition-colors duration-300">
                    <Plus size={14} /> Add Item
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SortableCategoryCard>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button onClick={() => setCatModal({ open: true, editing: null })} className="flex items-center gap-2 px-6 py-3 rounded-full bg-terracotta text-cream text-base font-medium hover:bg-terracotta/85 transition-all duration-200 shadow-[0_4px_14px_rgba(196,102,31,0.25)]">
          <Plus size={14} /> Add Category
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
        <SortableContext items={cats.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cats.map((cat) => renderCategoryCard(cat))}
        </SortableContext>
      </DndContext>
      <CategoryModal open={catModal.open} onClose={() => setCatModal({ open: false, editing: null })} onSave={handleSaveCategory} editing={catModal.editing} />
      <ProductModal open={prodModal.open} onClose={() => setProdModal({ open: false, editing: null, categoryId: '', nextOrder: 0 })} onSave={handleSaveProduct} editing={prodModal.editing} categoryId={prodModal.categoryId} nextOrder={prodModal.nextOrder} />
    </div>
  );
}
