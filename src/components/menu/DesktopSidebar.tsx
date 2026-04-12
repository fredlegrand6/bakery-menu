import { motion } from 'framer-motion';
import { Leaf, Wine, Calendar, Scroll, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuTab } from './TabBar';

const nav: { key: MenuTab; label: string; icon: typeof Leaf }[] = [
  { key: 'products', label: 'The Good Stuff', icon: Leaf },
  { key: 'drinks', label: 'Drinks & Bar', icon: Wine },
  { key: 'papiers', label: 'Papiers', icon: Scroll },
  { key: 'attributes', label: 'Attributes', icon: SlidersHorizontal },
  { key: 'events', label: "What's On", icon: Calendar },
];

interface Props {
  active: MenuTab;
  onChange: (tab: MenuTab) => void;
}

export default function DesktopSidebar({ active, onChange }: Props) {
  return (
    <aside className="hidden lg:flex fixed top-0 left-0 z-40 h-screen w-[200px] flex-col border-r border-gold/10 glass-soft">
      {/* brand block */}
      <div className="px-8 pt-10 pb-8 flex flex-col items-center text-center">
        <img src="/favicon.svg" alt="B" className="h-11 w-auto opacity-90" />
        <div className="hairline w-20 mt-4" />
        <span
          className="font-display mt-3 text-cream"
          style={{
            fontVariationSettings: '"SOFT" 20, "opsz" 144, "wght" 500',
            fontSize: '18px',
            letterSpacing: '0.02em',
          }}
        >
          The Bakery
        </span>
        <span className="font-accent italic text-[12px] text-gold/80 tracking-[0.35em] mt-1">
          IBIZA
        </span>
      </div>

      {/* vertical rail divider */}
      <div className="sidebar-rail h-px mx-6" />

      {/* nav */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {nav.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={cn(
                'group relative w-full flex items-center gap-2.5 pl-3 pr-2 py-3 rounded-xl transition-colors duration-300',
                isActive ? 'text-gold' : 'text-cream/55 hover:text-cream/90'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(212,162,76,0.14) 0%, rgba(212,162,76,0.02) 100%)',
                    boxShadow: 'inset 0 0 0 1px rgba(212,162,76,0.3)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              {isActive && (
                <motion.span
                  layoutId="sidebar-bar"
                  className="absolute left-0 top-1.5 bottom-1.5 w-[2px] rounded-full"
                  style={{
                    background:
                      'linear-gradient(180deg, transparent, rgba(212,162,76,0.95), transparent)',
                    boxShadow: '0 0 12px rgba(212,162,76,0.6)',
                  }}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                size={17}
                strokeWidth={isActive ? 2 : 1.6}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-0.5"
              />
              <span
                className={cn(
                  'relative z-10 text-[11px] uppercase tracking-[0.14em] font-medium transition-colors whitespace-nowrap',
                  isActive ? '' : 'group-hover:text-gold/90'
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* member badge */}
      <div className="px-6 pb-8 pt-4">
        <div className="hairline w-full mb-5" />
        <div className="relative rounded-2xl overflow-hidden glass px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-gold breathe shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold/85 font-medium">
                Members Only
              </p>
              <p className="font-accent italic text-[12px] text-cream/55 mt-0.5 leading-tight">
                The hills of Ibiza
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
