import { X, Package } from 'lucide-react';
import { useEffect } from 'react';
import type { Product } from '@/lib/types';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function ProductDetailModal({
  product,
  open,
  onClose,
}: ProductDetailModalProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !product) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center pdm-fade-in"
      style={{ touchAction: 'manipulation' }}
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 backdrop-blur-md"
        style={{ backgroundColor: 'rgba(10, 11, 7, 0.82)' }}
      />

      {/* content card — CSS slide-up, always visible */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="pdm-card relative z-10 w-full sm:max-w-lg sm:mx-4 max-h-[92vh] overflow-y-auto glass"
        style={{
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          backgroundColor: '#0D0D0D',
        }}
      >
        {/* handle bar */}
        <div className="sticky top-0 z-10 flex justify-center pt-3 pb-2 pointer-events-none">
          <div className="h-1 w-10 rounded-full bg-gold/35" />
        </div>

        {/* close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md text-gold/80 ring-1 ring-gold/25 hover:bg-gold/10 hover:text-gold hover:ring-gold/50 transition-all duration-300"
        >
          <X size={16} />
        </button>

        {/* hero image */}
        <div
          className="relative w-full aspect-[4/3] overflow-hidden"
          style={{ backgroundColor: '#1a1a1a' }}
        >
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
            <div className="w-full h-full flex items-center justify-center">
              <Package size={56} className="text-gold/30" strokeWidth={1.2} />
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, transparent 55%, rgba(13,13,13,0.6) 80%, #0D0D0D 100%)',
            }}
          />
        </div>

        <div className="px-6 pb-8 pt-2 sm:px-8">
          {/* type */}
          {product.product_type && (
            <div
              className="text-[11px] uppercase tracking-[0.32em] font-medium"
              style={{ color: '#C9A84C' }}
            >
              {product.product_type}
            </div>
          )}

          {/* name */}
          <h2
            className="mt-2 text-[34px] leading-[1.05] text-cream"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 500,
            }}
          >
            {product.name}
          </h2>

          {/* origin */}
          {product.origin && (
            <p
              className="mt-1.5 italic text-[14px] text-cream/55"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product.origin}
            </p>
          )}

          {/* gold divider */}
          <div
            className="my-6 h-px"
            style={{
              background:
                'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            }}
          />

          {/* stat boxes */}
          {(product.thc_percentage != null || product.cbd_percentage != null) && (
            <div className="grid grid-cols-2 gap-3">
              <StatBox label="THC" value={product.thc_percentage} />
              <StatBox label="CBD" value={product.cbd_percentage} />
            </div>
          )}

          {/* tasting notes */}
          {product.tasting_notes && product.tasting_notes.length > 0 && (
            <section className="mt-7">
              <SectionLabel>Tasting Notes</SectionLabel>
              <div className="flex flex-wrap gap-2 mt-3">
                {product.tasting_notes.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] tracking-[0.1em] px-3 py-1.5 rounded-full bg-white/[0.04] text-cream/75"
                    style={{ border: '0.5px solid rgba(255,250,224,0.08)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* effects */}
          {product.effects && product.effects.length > 0 && (
            <section className="mt-7">
              <SectionLabel>Effects</SectionLabel>
              <div className="flex flex-wrap gap-2 mt-3">
                {product.effects.map((effect) => (
                  <span
                    key={effect}
                    className="text-[11px] tracking-[0.14em] uppercase px-3 py-1.5 rounded-full font-medium"
                    style={{
                      border: '1px solid rgba(201,168,76,0.55)',
                      color: '#E8C17A',
                      background: 'rgba(201,168,76,0.06)',
                    }}
                  >
                    {effect}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* description */}
          {product.description && (
            <p
              className="mt-7 italic text-[15px] leading-relaxed text-cream/70"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {product.description}
            </p>
          )}

          {/* ask staff */}
          <button
            onClick={onClose}
            className="mt-9 w-full py-4 rounded-full uppercase tracking-[0.22em] text-[12px] font-medium transition-all duration-300 hover:brightness-110"
            style={{
              background:
                'linear-gradient(180deg, rgba(201,168,76,0.95) 0%, rgba(140,106,42,0.95) 100%)',
              color: '#0D0D0D',
              boxShadow:
                'inset 0 1px 0 rgba(255,250,224,0.3), 0 14px 32px -14px rgba(201,168,76,0.55)',
            }}
          >
            Ask Staff
          </button>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[10px] uppercase tracking-[0.32em] font-medium"
      style={{ color: '#C9A84C' }}
    >
      {children}
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number | null }) {
  return (
    <div
      className="rounded-2xl px-4 py-5 text-center"
      style={{
        background:
          'linear-gradient(180deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)',
        border: '1px solid rgba(201,168,76,0.22)',
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[0.28em] font-medium"
        style={{ color: '#C9A84C' }}
      >
        {label}
      </div>
      <div
        className="mt-2 text-[28px] leading-none text-cream"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 500,
        }}
      >
        {value != null ? `${value}%` : '—'}
      </div>
    </div>
  );
}
