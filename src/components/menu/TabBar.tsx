import { Leaf, Wine, Calendar, Scroll, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type MenuTab = 'products' | 'drinks' | 'events' | 'papiers' | 'attributes';

const tabs: { key: MenuTab; label: string; icon: typeof Leaf }[] = [
  { key: 'products', label: 'Menu', icon: Leaf },
  { key: 'drinks', label: 'Bar', icon: Wine },
  { key: 'papiers', label: 'Papiers', icon: Scroll },
  { key: 'attributes', label: 'Attributes', icon: SlidersHorizontal },
  { key: 'events', label: "What's On", icon: Calendar },
];

interface TabBarProps {
  active: MenuTab;
  onChange: (tab: MenuTab) => void;
}

export default function TabBar({ active, onChange }: TabBarProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden pb-[env(safe-area-inset-bottom)]">
      {/* fade mask above the dock so content dissolves into it */}
      <div
        aria-hidden
        className="absolute -top-10 left-0 right-0 h-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(10,11,7,0.7))',
        }}
      />

      <div className="glass-dock px-3 pt-3 pb-3">
        <div className="relative flex justify-around items-center">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = active === key;
            return (
              <button
                key={key}
                onClick={() => onChange(key)}
                className="relative flex flex-col items-center gap-1 px-2 py-2 min-w-[54px]"
                aria-label={label}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-pill"
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(212,162,76,0.18) 0%, rgba(212,162,76,0.04) 100%)',
                      boxShadow:
                        'inset 0 0 0 1px rgba(212,162,76,0.35), 0 6px 24px -8px rgba(212,162,76,0.35)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2 : 1.5}
                  className={cn(
                    'relative z-10 transition-colors duration-300',
                    isActive ? 'text-gold' : 'text-cream/40'
                  )}
                />
                <span
                  className={cn(
                    'relative z-10 text-[9px] uppercase tracking-[0.14em] transition-colors duration-300',
                    isActive ? 'text-gold font-medium' : 'text-cream/40'
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
