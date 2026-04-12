import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/menu/Header';
import DesktopHero from '@/components/menu/DesktopHero';
import DesktopSidebar from '@/components/menu/DesktopSidebar';
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

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState<MenuTab>('products');
  const Content = tabContent[activeTab];

  return (
    <div className="menu-shell relative min-h-screen w-full bg-obsidian text-cream">
      {/* ambient page atmosphere */}
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

      {/* DESKTOP: left sidebar */}
      <DesktopSidebar active={activeTab} onChange={setActiveTab} />

      {/* MAIN COLUMN — offset by sidebar width on lg */}
      <div
        className="relative z-10"
        style={{
          marginLeft: 'var(--sidebar-offset, 0px)',
          width: 'calc(100% - var(--sidebar-offset, 0px))',
        }}
      >
        {/* mobile hero */}
        <div className="lg:hidden">
          <Header />
        </div>

        {/* desktop cinematic banner */}
        <div className="hidden lg:block">
          <DesktopHero />
        </div>

        {/* CONTENT — max-w 1400 centered */}
        <main className="w-full pb-28 lg:pb-16">
          <div className="mx-auto w-full max-w-[1400px] lg:px-10 xl:px-16">
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
          </div>
        </main>

        {/* MOBILE DOCK */}
        <div className="lg:hidden">
          <TabBar active={activeTab} onChange={setActiveTab} />
        </div>
      </div>
    </div>
  );
}
