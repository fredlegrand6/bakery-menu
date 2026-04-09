import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { usePapiers, useSections } from '@/hooks/useMenu';
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
          isOpen ? 'bg-[#1e2318] border border-sage/15 rounded-b-none border-b-0' : 'bg-[#1e2318] border border-sage/10'
        )}
      >
        <div className="flex items-center gap-3">
          {cat.image_url && <img src={cat.image_url} alt="" className="w-10 h-10 rounded-xl object-cover" />}
          <div className="text-left">
            <h2 className="font-display text-xl font-bold text-cream leading-tight">{cat.name}</h2>
            <p className="text-xs text-sage/40 mt-0.5">{cat.bakery_products.length} item{cat.bakery_products.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25, ease: 'easeInOut' }} className={cn('w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300', isOpen ? 'bg-terracotta text-cream' : 'bg-white/5 text-sage/40')}>
          <ChevronDown size={16} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="md:hidden overflow-hidden bg-[#1e2318] border border-sage/15 border-t-0 rounded-b-2xl">
            <div className="p-4 space-y-4">
              {cat.description && <p className="font-accent italic text-sm text-sage/60 px-1">{cat.description}</p>}
              {cat.bakery_products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05, duration: 0.25 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="hidden md:block mt-2">
        <h2 className="font-display text-3xl font-bold text-cream">{cat.name}</h2>
        <div className="border-b border-sage/20 mt-2 mb-4" />
        {cat.description && <p className="font-accent italic text-base text-sage mb-5">{cat.description}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {cat.bakery_products.map((product, i) => (
            <motion.div key={product.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PapiersTab() {
  const { categories, loading } = usePapiers();
  const { sections } = useSections();
  const [openIds, setOpenIds] = useState<string[]>([]);
  const toggleCategory = (id: string) => setOpenIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  if (loading) return <ProductSkeleton />;
  if (categories.length === 0) return <EmptyState tab="products" />;

  const unsectioned = categories.filter((c) => !c.section_id);
  return (
    <AnimatePresence mode="wait">
      <motion.div key="papiers" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="px-4 md:px-12 lg:px-16 py-4 md:py-10 pb-40 md:pb-10 space-y-3 md:space-y-14">
        {unsectioned.map((cat) => <CategoryAccordion key={cat.id} cat={cat} openIds={openIds} toggleCategory={toggleCategory} />)}
        {sections.map((section) => {
          const sectionCats = categories.filter((c) => c.section_id === section.id);
          if (sectionCats.length === 0) return null;
          return (
            <div key={section.id}>
              <div className="px-0 pt-8 pb-1"><h2 className="font-display text-2xl font-bold text-cream">{section.name}</h2><div className="w-10 h-0.5 bg-terracotta mt-2 mb-1" /></div>
              <div className="space-y-3 md:space-y-14">{sectionCats.map((cat) => <CategoryAccordion key={cat.id} cat={cat} openIds={openIds} toggleCategory={toggleCategory} />)}</div>
            </div>
          );
        })}
        <div style={{ height: '100px' }} aria-hidden="true" className="md:hidden" />
      </motion.div>
    </AnimatePresence>
  );
}
