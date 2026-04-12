import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useDrinks } from '@/hooks/useMenu';
import DrinkCard from './DrinkCard';
import { DrinkSkeleton } from './SkeletonCards';
import EmptyState from './EmptyState';
import MoreComingSoon from './MoreComingSoon';
import { cn } from '@/lib/utils';

export default function DrinksTab() {
  const { categories, loading } = useDrinks();
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isOpen = (id: string) => openIds.includes(id);

  if (loading) return <DrinkSkeleton />;
  if (categories.length === 0) return <EmptyState tab="drinks" />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="drinks"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-4 md:px-12 lg:px-16 py-4 md:py-10 pb-40 md:pb-10 space-y-3 md:space-y-14"
      >
        {categories.map((cat, catIdx) => (
          <section key={cat.id}>

            {/* ── MOBILE: tappable accordion header ── */}
            <button
              onClick={() => toggleCategory(cat.id)}
              className={cn(
                'md:hidden w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300',
                isOpen(cat.id)
                  ? 'glass-soft rounded-b-none border-b-0'
                  : 'glass-soft'
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="w-1.5 h-8 rounded-full"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(212,162,76,0.85) 0%, rgba(140,106,42,0.2) 100%)',
                    boxShadow: '0 0 12px rgba(212,162,76,0.35)',
                  }}
                />
                <div className="text-left">
                  <h2
                    className="font-display text-[22px] text-cream leading-tight"
                    style={{ fontVariationSettings: '"SOFT" 40, "opsz" 144, "wght" 500' }}
                  >
                    {cat.name}
                  </h2>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gold/55 mt-1">
                    {cat.bakery_drinks.length} item{cat.bakery_drinks.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <motion.div
                animate={{ rotate: isOpen(cat.id) ? 180 : 0 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300',
                  isOpen(cat.id)
                    ? 'bg-gradient-to-b from-gold/90 to-gold-deep text-obsidian shadow-[0_6px_20px_-6px_rgba(212,162,76,0.6)]'
                    : 'bg-white/[0.04] text-gold/60 ring-1 ring-gold/20'
                )}
              >
                <ChevronDown size={16} />
              </motion.div>
            </button>

            {/* ── MOBILE: animated drink drawer ── */}
            <AnimatePresence initial={false}>
              {isOpen(cat.id) && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                  className="md:hidden overflow-hidden glass-soft border-t-0 rounded-b-2xl"
                >
                  <div className="p-4 space-y-4">
                    {cat.description && (
                      <p className="font-accent italic text-[15px] text-cream/55 px-1 leading-snug">{cat.description}</p>
                    )}
                    {cat.bakery_drinks.map((drink, i) => (
                      <DrinkCard key={drink.id} drink={drink} index={i} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── DESKTOP: always expanded, original layout ── */}
            <div className={cn('hidden md:block', catIdx === 0 ? 'mt-0' : 'mt-2')}>
              <h2
                className="font-display text-[40px] text-cream leading-tight"
                style={{ fontVariationSettings: '"SOFT" 50, "opsz" 144, "wght" 400' }}
              >
                {cat.name}
              </h2>
              <div className="hairline w-full mt-3 mb-5" />
              {cat.description && (
                <p className="font-accent italic text-lg text-cream/60 mb-6 max-w-2xl">{cat.description}</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
                {cat.bakery_drinks.map((drink, i) => (
                  <DrinkCard key={drink.id} drink={drink} index={i} />
                ))}
              </div>
            </div>

          </section>
        ))}
        <MoreComingSoon label="More pouring soon" />
        <div style={{ height: '100px' }} aria-hidden="true" className="md:hidden" />
      </motion.div>
    </AnimatePresence>
  );
}
