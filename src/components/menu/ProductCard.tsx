import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/lib/types';
import ProductDetailModal from './ProductDetailModal';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  return (
    <>
      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.05, ease: EASE }}
        className="group relative rounded-[22px] overflow-hidden glass cursor-pointer select-none"
        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        {/* gold top hairline on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(212,162,76,0.7), transparent)',
          }}
        />

        {/* media */}
        <div
          className="relative aspect-[16/10] overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.03] pointer-events-none"
          style={{ backgroundColor: '#1a1a1a' }}
        >
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

          {/* cinematic bottom gradient */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(10,11,7,0.98) 0%, rgba(10,11,7,0.72) 25%, rgba(10,11,7,0.25) 55%, transparent 80%)',
            }}
          />

          {/* title block */}
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 pl-6 pr-5 pb-5 pt-4 md:pl-7 md:pr-6 md:pb-6">
            {product.product_type && (
              <span
                className="text-[10px] uppercase tracking-[0.26em] font-medium"
                style={{ color: '#C9A84C' }}
              >
                {product.product_type}
              </span>
            )}
            <h3
              className="font-display text-[26px] md:text-[30px] leading-[1.02] text-cream mt-1.5"
              style={{ fontVariationSettings: '"SOFT" 40, "opsz" 144, "wght" 500' }}
            >
              {product.name}
            </h3>
          </div>
        </div>
      </motion.article>

      <ProductDetailModal
        product={product}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
