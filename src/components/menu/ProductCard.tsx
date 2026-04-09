import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="rounded-2xl overflow-hidden bg-black/25 border border-sage/[0.08] hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-shadow duration-300"
    >
      {/* Media with overlay */}
      <div className="relative aspect-[16/9]">
        {product.video_url ? (
          <video
            src={product.video_url}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        ) : product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-olive-dark/80 to-olive/40 flex items-center justify-center">
            <Package size={40} className="text-sage/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-display text-2xl font-bold text-cream leading-tight">{product.name}</h3>
          {product.description && (
            <p className="text-sm text-cream/65 mt-1.5 line-clamp-2">{product.description}</p>
          )}
        </div>
      </div>

      {/* Effects tags */}
      {product.effects && product.effects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-4">
          {product.effects.map((effect) => (
            <span
              key={effect}
              className="text-[11px] px-2.5 py-1 rounded-full border border-sage/15 text-sage font-medium"
            >
              {effect}
            </span>
          ))}
        </div>
      )}

      {/* Variant selector */}
      {product.variants.length > 0 && (
        <div className="flex gap-2 p-5">
          {product.variants.map((variant, i) => (
            <button
              key={i}
              onClick={() => setSelectedVariant(i)}
              className={cn(
                'flex-1 flex flex-col items-center gap-1 py-3 px-3 rounded-xl border transition-all duration-300',
                selectedVariant === i
                  ? 'bg-terracotta border-terracotta text-cream shadow-[0_4px_16px_rgba(196,102,31,0.3)]'
                  : 'bg-white/[0.04] border-sage/10 hover:border-sage/20'
              )}
            >
              <span className={cn(
                'text-[11px] font-medium transition-colors duration-300',
                selectedVariant === i ? 'text-cream/80' : 'text-sage/50'
              )}>
                {variant.label}
              </span>
              <span className={cn(
                'font-display text-lg font-bold transition-colors duration-300',
                selectedVariant === i ? 'text-cream' : 'text-terracotta'
              )}>
                {formatPrice(variant.price_cents)}
              </span>
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
