import { Leaf, Wine, Calendar, Scroll, SlidersHorizontal } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type MenuTab = 'products' | 'drinks' | 'events' | 'papiers' | 'attributes';

const tabs: { key: MenuTab; label: string; icon: typeof Leaf }[] = [
  { key: 'products', label: 'The Good Stuff', icon: Leaf },
  { key: 'drinks', label: 'Drinks & Bar', icon: Wine },
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
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-olive-dark/90 backdrop-blur-xl border-t border-sage/[0.06] pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex justify-around items-center h-20">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className="relative flex flex-col items-center gap-1 px-3 py-2 transition-colors duration-300 text-xs font-medium"
          >
            {active === key && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute inset-0 bg-terracotta/15 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              size={20}
              strokeWidth={active === key ? 2.2 : 1.5}
              className={cn('relative z-10 transition-colors duration-300', active === key ? 'text-cream' : 'text-sage/40')}
            />
            <span className={cn('relative z-10 transition-colors duration-300 text-[10px]', active === key ? 'text-cream' : 'text-sage/40')}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
