import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Leaf, Wine, Calendar, Scroll, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import Header from '@/components/menu/Header';
import TabBar, { type MenuTab } from '@/components/menu/TabBar';
import ProductsTab from '@/components/menu/ProductsTab';
import DrinksTab from '@/components/menu/DrinksTab';
import EventsTab from '@/components/menu/EventsTab';
import PapiersTab from '@/components/menu/PapiersTab';
import AttributesTab from '@/components/menu/AttributesTab';

const tabContent: Record<MenuTab, React.FC> = {
  products: ProductsTab,
  drinks: DrinksTab,
  events: EventsTab,
  papiers: PapiersTab,
  attributes: AttributesTab,
};

const desktopNav: { key: MenuTab; label: string; icon: typeof Leaf }[] = [
  { key: 'products', label: 'The Good Stuff', icon: Leaf },
  { key: 'drinks', label: 'Drinks & Bar', icon: Wine },
  { key: 'papiers', label: 'Papiers', icon: Scroll },
  { key: 'attributes', label: 'Attributes', icon: SlidersHorizontal },
  { key: 'events', label: "What's On", icon: Calendar },
];

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>('products');
  const Content = tabContent[activeTab];

  return (
    <div className="relative min-h-screen w-full bg-obsidian text-cream">
      {/* Ambient page atmosphere — very slow gold mist behind everything */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] aurora-1 opacity-40"
          style={{
            background:
              'radial-gradient(circle at center, rgba(212,162,76,0.14), transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[-30%] right-[-20%] w-[90vw] h-[90vw] aurora-2 opacity-35"
          style={{
            background:
              'radial-gradient(circle at center, rgba(95,111,82,0.18), transparent 65%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="relative z-10">
        {/* HEADER — mobile */}
        <div className="md:hidden">
          <Header />
        </div>

        {/* DESKTOP NAV */}
        <header className="hidden md:block sticky top-0 z-40 glass-soft">
          <div className="px-10 py-6 flex flex-col items-center gap-3">
            <img src="/favicon.svg" alt="The Bakery" className="h-10 w-auto opacity-90" />
            <div className="hairline w-28" />
            <span className="font-accent italic text-sm text-gold/85 tracking-[0.4em]">
              Ibiza
            </span>
            <nav className="flex items-center justify-center gap-1 pt-1">
              {desktopNav.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key)}
                    className={cn(
                      'relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-medium tracking-wide transition-all duration-300',
                      active ? 'text-gold' : 'text-cream/45 hover:text-cream/80'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="desktop-nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(212,162,76,0.16) 0%, rgba(212,162,76,0.04) 100%)',
                          boxShadow: 'inset 0 0 0 1px rgba(212,162,76,0.4)',
                        }}
                        transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                      />
                    )}
                    <Icon size={14} className="relative" />
                    <span className="relative">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </header>

        {/* CONTENT */}
        <main className="w-full pb-28 md:pb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(6px)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <Content />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* MOBILE DOCK */}
        <div className="md:hidden">
          <TabBar active={activeTab} onChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
