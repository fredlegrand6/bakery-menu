import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Pencil, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAdminCategories, useAdminDrinks } from '@/hooks/useAdminData';
import { formatPrice, cn } from '@/lib/utils';
import CategoryModal from './CategoryModal';
import DrinkModal from './DrinkModal';
import type { Category, Drink, CategoryWithDrinks } from '@/lib/types';

function SortableCategoryCard({ cat, children }: { cat: CategoryWithDrinks; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing text-gold/30 hover:text-gold/60 p-2"
      >
        <GripVertical size={16} />
      </div>
      {children}
    </div>
  );
}

function SortableDrinkRow({ drink, children }: { drink: Drink; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: drink.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <div className="group/row flex items-center gap-3 p-4 rounded-xl bg-white/[0.015] border-b border-gold/10 border-l-2 border-l-transparent hover:border-l-gold/70 hover:bg-gold/[0.03] transition-all duration-300">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical size={14} className="text-gold/30 shrink-0 hover:text-gold/60 transition-colors" />
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminDrinksTab({ onCategoryChange }: { onCategoryChange?: () => void }) {
  const { categories, refetch, addCategory, updateCategory, deleteCategory, reorderCategories } = useAdminCategories('drinks');
  const { addDrink, updateDrink, deleteDrink, reorderDrinks } = useAdminDrinks();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [catModal, setCatModal] = useState<{ open: boolean; editing: Category | null }>({ open: false, editing: null });
  const [drinkModal, setDrinkModal] = useState<{ open: boolean; editing: Drink | null; categoryId: string; nextOrder: number }>({
    open: false, editing: null, categoryId: '', nextOrder: 0,
  });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const cats = categories as CategoryWithDrinks[];

  const handleCatDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = cats.findIndex((c) => c.id === active.id);
    const newIndex = cats.findIndex((c) => c.id === over.id);
    const newOrder = arrayMove(cats, oldIndex, newIndex);
    reorderCategories(newOrder.map((c) => c.id));
  };

  const handleDrinkDragEnd = (catId: string) => (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const cat = cats.find((c) => c.id === catId);
    if (!cat) return;
    const items = cat.bakery_drinks || [];
    const oldIndex = items.findIndex((d) => d.id === active.id);
    const newIndex = items.findIndex((d) => d.id === over.id);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    reorderDrinks(newOrder.map((d) => d.id)).then(refetch);
  };

  const handleSaveCategory = async (data: { name: string; description: string; image_url: string | null; video_url: string | null; section_id: string | null }) => {
    if (catModal.editing) {
      await updateCategory(catModal.editing.id, {
        name: data.name,
        description: data.description || null,
        image_url: data.image_url,
        video_url: data.video_url,
        section_id: data.section_id,
      });
    } else {
      await addCategory(data);
    }
    onCategoryChange?.();
  };

  const handleSaveDrink = async (data: Parameters<typeof addDrink>[0]) => {
    try {
      if (drinkModal.editing) {
        await updateDrink(drinkModal.editing.id, data);
      } else {
        await addDrink(data);
      }
      await refetch();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteDrink = async (id: string) => {
    if (!confirm('Delete this drink?')) return;
    try {
      await deleteDrink(id);
      await refetch();
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category and all its drinks?')) return;
    await deleteCategory(id);
    onCategoryChange?.();
  };

  const renderCategoryCard = (cat: CategoryWithDrinks) => {
    const isOpen = expandedId === cat.id;
    const items = cat.bakery_drinks || [];
    return (
      <SortableCategoryCard key={cat.id} cat={cat}>
        <div
          className={cn(
            'group/cat rounded-2xl border-b border-gold/10 border-l-2 border-l-transparent overflow-hidden transition-all duration-300 ml-6',
            isOpen ? 'bg-gold/[0.025] border-l-gold/70' : 'hover:bg-gold/[0.02] hover:border-l-gold/40'
          )}
        >
          <button
            onClick={() => setExpandedId(isOpen ? null : cat.id)}
            className="w-full flex items-center gap-4 p-5 text-left"
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
              <ChevronDown size={15} className="text-gold/60" />
            </motion.div>
            <div
              className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(212,162,76,0.22), rgba(140,106,42,0.1))',
                boxShadow: 'inset 0 0 0 1px rgba(212,162,76,0.32)',
              }}
            >
              <span
                className="font-display text-xl gold-shimmer"
                style={{ fontVariationSettings: '"SOFT" 20, "opsz" 144, "wght" 500' }}
              >
                {cat.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <span
                className="font-display text-xl text-cream"
                style={{ fontVariationSettings: '"SOFT" 30, "opsz" 144, "wght" 500' }}
              >
                {cat.name}
              </span>
              <span
                className={cn(
                  'text-[9px] font-medium uppercase tracking-[0.22em] px-2.5 py-1 rounded-full',
                  cat.is_active
                    ? 'bg-gold/15 text-gold border border-gold/30'
                    : 'bg-white/[0.03] text-cream/35 border border-cream/10'
                )}
              >
                {cat.is_active ? 'Active' : 'Hidden'}
              </span>
            </div>
            <span className="text-[11px] uppercase tracking-[0.18em] text-cream/55 font-medium tabular-nums">
              {items.length} <span className="text-cream/35">item{items.length !== 1 ? 's' : ''}</span>
            </span>
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-2 border-t border-gold/10 pt-4">
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => updateCategory(cat.id, { is_active: !cat.is_active })}
                      title={cat.is_active ? 'Hide category' : 'Show category'}
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.03] text-gold/60 ring-1 ring-gold/15 hover:bg-gold/10 hover:text-gold hover:ring-gold/40 transition-all duration-300"
                    >
                      {cat.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => setCatModal({ open: true, editing: cat })}
                      title="Edit category"
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.03] text-gold/60 ring-1 ring-gold/15 hover:bg-gold/10 hover:text-gold hover:ring-gold/40 transition-all duration-300"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      title="Delete category"
                      className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/[0.03] text-red-400/60 ring-1 ring-red-400/15 hover:bg-red-500/10 hover:text-red-300 hover:ring-red-400/40 transition-all duration-300"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDrinkDragEnd(cat.id)}>
                    <SortableContext items={items.map((d) => d.id)} strategy={verticalListSortingStrategy}>
                      {items.map((drink) => (
                        <SortableDrinkRow key={drink.id} drink={drink}>
                          <div
                            className="w-10 h-10 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
                            style={{
                              background: 'linear-gradient(160deg, rgba(212,162,76,0.18), rgba(140,106,42,0.08))',
                              boxShadow: 'inset 0 0 0 1px rgba(212,162,76,0.25)',
                            }}
                          >
                            <span
                              className="font-display text-sm text-gold"
                              style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}
                            >
                              {drink.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-[15px] text-cream truncate font-display"
                              style={{ fontVariationSettings: '"SOFT" 20, "opsz" 144, "wght" 500' }}
                            >
                              {drink.name}
                            </p>
                            <p className="text-[10px] uppercase tracking-[0.16em] text-cream/40 mt-0.5">{formatPrice(drink.price_cents)}</p>
                          </div>
                          <button
                            onClick={() => updateDrink(drink.id, { is_available: !drink.is_available }).then(refetch)}
                            className={cn(
                              'text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border transition-all duration-300',
                              drink.is_available
                                ? 'bg-gold/15 text-gold border-gold/35'
                                : 'bg-white/[0.03] text-cream/35 border-cream/10'
                            )}
                          >
                            {drink.is_available ? 'Live' : 'Off'}
                          </button>
                          <button onClick={() => setDrinkModal({ open: true, editing: drink, categoryId: cat.id, nextOrder: 0 })} className="text-cream/30 hover:text-gold transition-colors duration-300">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => handleDeleteDrink(drink.id)} className="text-cream/30 hover:text-red-400 transition-colors duration-300">
                            <Trash2 size={14} />
                          </button>
                        </SortableDrinkRow>
                      ))}
                    </SortableContext>
                  </DndContext>

                  <button
                    onClick={() => setDrinkModal({ open: true, editing: null, categoryId: cat.id, nextOrder: items.length })}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-gold/20 text-gold/55 hover:text-gold hover:border-gold/50 hover:bg-gold/[0.03] text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
                  >
                    <Plus size={13} /> Add Drink
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
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setCatModal({ open: true, editing: null })}
          className="group relative flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold text-obsidian transition-all duration-300 hover:shadow-[0_10px_30px_-6px_rgba(212,162,76,0.6)]"
          style={{
            background: 'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 6px 20px -8px rgba(212,162,76,0.5)',
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Add Category
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleCatDragEnd}>
        <SortableContext items={cats.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cats.map((cat) => renderCategoryCard(cat))}
        </SortableContext>
      </DndContext>

      <CategoryModal
        open={catModal.open}
        onClose={() => setCatModal({ open: false, editing: null })}
        onSave={handleSaveCategory}
        editing={catModal.editing}
      />
      <DrinkModal
        open={drinkModal.open}
        onClose={() => setDrinkModal({ open: false, editing: null, categoryId: '', nextOrder: 0 })}
        onSave={handleSaveDrink}
        editing={drinkModal.editing}
        categoryId={drinkModal.categoryId}
        nextOrder={drinkModal.nextOrder}
      />
    </div>
  );
}
