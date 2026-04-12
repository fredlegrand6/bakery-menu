import { motion } from 'framer-motion';
import { Wine } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Drink } from '@/lib/types';

interface DrinkCardProps {
  drink: Drink;
  index?: number;
}

export default function DrinkCard({ drink, index = 0 }: DrinkCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className="group relative flex items-center gap-4 p-4 rounded-2xl glass overflow-hidden"
    >
      {/* thumb */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 ring-1 ring-gold/15">
        {drink.image_url ? (
          <img
            src={drink.image_url}
            alt={drink.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gold/20 via-smoke to-char flex items-center justify-center">
            <Wine size={22} className="text-gold/50" strokeWidth={1.4} />
          </div>
        )}
      </div>

      {/* body */}
      <div className="flex-1 min-w-0">
        <h3
          className="font-display text-[19px] text-cream truncate leading-tight"
          style={{ fontVariationSettings: '"SOFT" 30, "opsz" 144, "wght" 500' }}
        >
          {drink.name}
        </h3>
        {drink.description && (
          <p className="font-accent italic text-[13px] text-cream/55 line-clamp-1 mt-0.5">
            {drink.description}
          </p>
        )}
      </div>

      {/* price */}
      <div className="flex flex-col items-end shrink-0">
        <span
          className="font-display text-[20px] text-gold leading-none"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}
        >
          {formatPrice(drink.price_cents)}
        </span>
      </div>
    </motion.div>
  );
}
