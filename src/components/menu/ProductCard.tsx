import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { formatPrice, cn } from '@/lib/utils';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, delay: index * 0.06, ease: EASE }}
      className="group relative rounded-[22px] overflow-hidden glass"
    >
      {/* gold top hairline on hover */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,162,76,0.7), transparent)',
        }}
      />

      {/* media */}
      <div
        className="relative aspect-[16/10] overflow-hidden transition-transform duration-500 ease-out hover:scale-105"
        style={{ backgroundColor: '#1a1a1a' }}
      >
        {/* shimmer placeholder — fades out once media loads */}
        {(product.image_url || product.video_url) && !mediaLoaded && (
          <div aria-hidden className="skeleton absolute inset-0" />
        )}

        {product.video_url ? (
          <video
            src={product.video_url}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setMediaLoaded(true)}
            onCanPlay={() => setMediaLoaded(true)}
            className={cn(
              'w-full h-full object-cover relative',
              mediaLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transition: 'opacity 0.4s ease' }}
          />
        ) : product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setMediaLoaded(true)}
            className={cn(
              'w-full h-full object-cover relative',
              mediaLoaded ? 'opacity-100' : 'opacity-0'
            )}
            style={{ transition: 'opacity 0.4s ease' }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-smoke to-char flex items-center justify-center">
            <Package size={44} className="text-gold/25" strokeWidth={1.2} />
          </div>
        )}

        {/* warm tint for white/grey product photos */}
        <div
          aria-hidden
          className="absolute inset-0 mix-blend-multiply"
          style={{
            background:
              'linear-gradient(180deg, rgba(10,11,7,0.35) 0%, rgba(10,11,7,0.15) 40%, rgba(10,11,7,0.0) 100%)',
          }}
        />
        {/* cinematic bottom gradient for legibility */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(10,11,7,0.98) 0%, rgba(10,11,7,0.72) 25%, rgba(10,11,7,0.25) 55%, transparent 80%)',
          }}
        />

        {/* title block — explicit left padding */}
        <div className="absolute bottom-0 left-0 right-0 pl-6 pr-5 pb-5 pt-4 md:pl-7 md:pr-6 md:pb-6">
          <h3
            className="font-display text-[26px] md:text-[30px] leading-[1.02] text-cream pl-0.5"
            style={{ fontVariationSettings: '"SOFT" 40, "opsz" 144, "wght" 500' }}
          >
            {product.name}
          </h3>
          {product.description && (
            <p className="font-accent italic text-[15px] text-cream/70 mt-1.5 line-clamp-2 leading-snug pl-0.5">
              {product.description}
            </p>
          )}
        </div>
      </div>

      {/* effect tags */}
      {product.effects && product.effects.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-4 md:px-6">
          {product.effects.map((effect) => (
            <span
              key={effect}
              className="text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full border border-gold/20 text-gold/85 bg-gold/[0.03] font-medium"
            >
              {effect}
            </span>
          ))}
        </div>
      )}

      {/* variants */}
      {product.variants.length > 0 && (
        <div className="flex gap-2 p-5 md:p-6">
          {product.variants.map((variant, i) => {
            const active = selectedVariant === i;
            return (
              <button
                key={i}
                onClick={() => setSelectedVariant(i)}
                style={{ borderWidth: '0.5px' }}
                className={cn(
                  'ring-gold relative flex-1 flex flex-col items-center gap-1 py-3 px-3 rounded-2xl transition-all duration-500',
                  active
                    ? 'border-gold/55 bg-gradient-to-b from-gold/12 to-gold/[0.015]'
                    : 'border-gold/20 bg-white/[0.015] hover:border-gold/35'
                )}
              >
                {active && (
                  <motion.div
                    layoutId={`glow-${product.id}`}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow:
                        'inset 0 0 0 0.5px rgba(212,162,76,0.55), 0 12px 32px -12px rgba(212,162,76,0.4)',
                    }}
                    transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                  />
                )}
                <span
                  className={cn(
                    'relative text-[10px] uppercase tracking-[0.18em] font-medium transition-colors',
                    active ? 'text-gold-soft' : 'text-cream/55'
                  )}
                >
                  {variant.label}
                </span>
                <span
                  className={cn(
                    'relative font-display text-lg transition-colors',
                    active ? 'text-cream' : 'text-cream/85'
                  )}
                  style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}
                >
                  {formatPrice(variant.price_cents)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </motion.article>
  );
}
