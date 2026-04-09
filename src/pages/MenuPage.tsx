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

const sidebarNav: { key: MenuTab; label: string; icon: typeof Leaf }[] = [
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
    <div className="min-h-screen w-full bg-[#252b1e]">

      {/* HEADER — mobile */}
      <div className="md:hidden">
        <Header />
      </div>

      {/* DESKTOP TOP NAV */}
      <header className="hidden md:block sticky top-0 z-40 bg-[#1e2318]/95 backdrop-blur-md border-b border-sage/10">
        <div className="px-10 py-5 flex flex-col items-center gap-3">
          <img src="/favicon.svg" alt="B" className="h-10 w-auto" />
          <div className="w-6 h-px bg-terracotta" />
          <span className="font-accent italic text-sm text-sage tracking-[0.4em]">Ibiza</span>
          <nav className="flex items-center justify-center gap-2 pb-1">
            {sidebarNav.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={cn(
                    'flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-terracotta text-cream'
                      : 'text-sage/50 hover:text-sage hover:bg-white/5'
                  )}
                >
                  <Icon size={15} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* CONTENT */}
      <main className="w-full pb-24 md:pb-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Content />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MOBILE BOTTOM TAB BAR */}
      <div className="md:hidden">
        <TabBar active={activeTab} onChange={setActiveTab} />
      </div>

    </div>
  );
}
