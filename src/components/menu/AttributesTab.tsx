import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useAttributes, useSections } from '@/hooks/useMenu';
import ProductCard from './ProductCard';
import { ProductSkeleton } from './SkeletonCards';
import EmptyState from './EmptyState';
import { cn } from '@/lib/utils';
import type { CategoryWithProducts } from '@/lib/types';

function CategoryAccordion({ cat, openIds, toggleCategory }: {
  cat: CategoryWithProducts;
  openIds: string[];
  toggleCategory: (id: string) => void;
}) {
  const isOpen = openIds.includes(cat.id);
  return (
    <section>
      <button
        onClick={() => toggleCategory(cat.id)}
        className={cn(
          'md:hidden w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300',
          isOpen ? 'glass-soft rounded-b-none border-b-0' : 'glass-soft'
        )}
      >
        <div className="flex items-center gap-3">
          <span aria-hidden className="w-1.5 h-8 rounded-full" style={{ background: 'linear-gradient(180deg, rgba(212,162,76,0.85) 0%, rgba(140,106,42,0.2) 100%)', boxShadow: '0 0 12px rgba(212,162,76,0.35)' }} />
          <div className="text-left">
            <h2 className="font-display text-[22px] text-cream leading-tight" style={{ fontVariationSettings: '"SOFT" 40, "opsz" 144, "wght" 500' }}>{cat.name}</h2>
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold/55 mt-1">{cat.bakery_products.length} item{cat.bakery_products.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className={cn('w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-400', isOpen ? 'bg-gradient-to-b from-gold/90 to-gold-deep text-obsidian shadow-[0_6px_20px_-6px_rgba(212,162,76,0.6)]' : 'bg-white/[0.04] text-gold/60 ring-1 ring-gold/20')}>
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="md:hidden overflow-hidden glass-soft border-t-0 rounded-b-2xl">
            <div className="p-4 space-y-4">
              {cat.description && <p className="font-accent italic text-[15px] text-cream/55 px-1 leading-snug">{cat.description}</p>}
              {cat.bakery_products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden md:block mt-2">
        <h2 className="font-display text-[40px] text-cream leading-tight" style={{ fontVariationSettings: '"SOFT" 50, "opsz" 144, "wght" 400' }}>{cat.name}</h2>
        <div className="hairline w-full mt-3 mb-5" />
        {cat.description && <p className="font-accent italic text-lg text-cream/60 mb-6 max-w-2xl">{cat.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {cat.bakery_products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AttributesTab() {
  const { categories, loading } = useAttributes();
  const { sections } = useSections();
  const [openIds, setOpenIds] = useState<string[]>([]);
  const toggleCategory = (id: string) => setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  if (loading) return <ProductSkeleton />;
  if (categories.length === 0) return <EmptyState tab="products" />;

  const unsectioned = categories.filter((c) => !c.section_id);
  return (
    <AnimatePresence mode="wait">
      <motion.div key="attributes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 md:px-8 lg:px-0 py-4 md:py-10 lg:pt-4 pb-40 md:pb-10 space-y-3 md:space-y-14">
        {unsectioned.map((cat) => <CategoryAccordion key={cat.id} cat={cat} openIds={openIds} toggleCategory={toggleCategory} />)}
        {sections.map((section) => {
          const sectionCats = categories.filter((c) => c.section_id === section.id);
          if (sectionCats.length === 0) return null;
          return (
            <div key={section.id}>
              <div className="px-1 pt-10 pb-2"><span className="text-[10px] uppercase tracking-[0.35em] text-gold/70">Section</span><h2 className="font-display text-[26px] text-cream mt-1" style={{ fontVariationSettings: '"SOFT" 30, "opsz" 144, "wght" 400' }}>{section.name}</h2><div className="hairline w-16 mt-2 mb-2" /></div>
              <div className="space-y-3 md:space-y-14">{sectionCats.map((cat) => <CategoryAccordion key={cat.id} cat={cat} openIds={openIds} toggleCategory={toggleCategory} />)}</div>
            </div>
          );
        })}
        <div style={{ height: '100px' }} aria-hidden="true" className="md:hidden" />
      </motion.div>
    </AnimatePresence>
  );
}
