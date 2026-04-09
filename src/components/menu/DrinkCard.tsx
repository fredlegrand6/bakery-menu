import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import type { Drink } from '@/lib/types';

interface DrinkCardProps {
  drink: Drink;
}

export default function DrinkCard({ drink }: DrinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-sage/[0.08] backdrop-blur-sm"
    >
      {drink.image_url ? (
        <img
          src={drink.image_url}
          alt={drink.name}
          className="w-20 h-20 rounded-xl object-cover shrink-0"
        />
      ) : (
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-terracotta/20 to-khaki/15 shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-display text-lg font-semibold text-cream truncate">{drink.name}</h3>
        {drink.description && (
          <p className="text-sm text-cream/50 line-clamp-1 mt-0.5">{drink.description}</p>
        )}
      </div>
      <span className="font-display text-xl font-bold text-terracotta shrink-0">
        {formatPrice(drink.price_cents)}
      </span>
    </motion.div>
  );
}
