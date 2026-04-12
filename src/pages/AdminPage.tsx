import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, GlassWater, CalendarDays, QrCode, LogOut, Scroll, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAdminCategories } from '@/hooks/useAdminData';
import { useAdminEvents } from '@/hooks/useAdminData';
import PasswordGate from '@/components/admin/PasswordGate';
import AdminProductsTab from '@/components/admin/AdminProductsTab';
import AdminDrinksTab from '@/components/admin/AdminDrinksTab';
import AdminEventsTab from '@/components/admin/AdminEventsTab';
import AdminQRTab from '@/components/admin/AdminQRTab';
import AdminPapiersTab from '@/components/admin/AdminPapiersTab';
import AdminAttributesTab from '@/components/admin/AdminAttributesTab';
import type { CategoryWithProducts, CategoryWithDrinks } from '@/lib/types';

type AdminTab = 'products' | 'drinks' | 'events' | 'qr' | 'papiers' | 'attributes';

const navItems: { key: AdminTab; label: string; icon: typeof Package }[] = [
  { key: 'products', label: 'Products', icon: Package },
  { key: 'drinks', label: 'Drinks', icon: GlassWater },
  { key: 'events', label: 'Events', icon: CalendarDays },
  { key: 'papiers', label: 'Papiers', icon: Scroll },
  { key: 'attributes', label: 'Attributes', icon: SlidersHorizontal },
  { key: 'qr', label: 'QR Code', icon: QrCode },
];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('products');
  const [refreshKey, setRefreshKey] = useState(0);
  const triggerRefresh = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    if (sessionStorage.getItem('bakery_admin') === 'true') {
      setAuthed(true);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('bakery_admin');
    setAuthed(false);
  };

  if (!authed) return <PasswordGate onAuthenticated={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-obsidian text-cream">
      {/* Desktop Sidebar — darker than main content */}
      <aside
        className="hidden lg:flex flex-col w-[240px] shrink-0 h-screen sticky top-0 border-r border-gold/10 overflow-hidden"
        style={{ backgroundColor: '#0d0d0d' }}
      >
        {/* brand block */}
        <div className="relative flex flex-col items-center py-10 px-6 border-b border-gold/10">
          <img src="/favicon.svg" alt="B" className="h-12 w-auto opacity-95" />
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
          <span className="font-accent italic text-[11px] text-gold/80 tracking-[0.35em] mt-1">
            ADMIN
          </span>
        </div>

        {/* nav */}
        <nav className="relative flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  'group relative w-full flex items-center gap-2.5 pl-4 pr-3 py-3 rounded-xl transition-colors duration-300',
                  active ? 'text-gold' : 'text-cream/50 hover:text-cream/90'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="admin-nav-indicator"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(212,162,76,0.13) 0%, rgba(212,162,76,0.02) 100%)',
                      boxShadow: 'inset 0 0 0 1px rgba(212,162,76,0.28)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                {/* gold dot indicator for active */}
                <span
                  className={cn(
                    'relative z-10 w-1.5 h-1.5 rounded-full transition-all duration-300 shrink-0',
                    active
                      ? 'bg-gold shadow-[0_0_10px_rgba(212,162,76,0.7)]'
                      : 'bg-cream/20 group-hover:bg-gold/40'
                  )}
                />
                <Icon
                  size={15}
                  strokeWidth={active ? 2 : 1.5}
                  className="relative z-10"
                />
                <span
                  className={cn(
                    'relative z-10 text-[11px] uppercase tracking-[0.2em] font-medium whitespace-nowrap',
                    active ? '' : 'group-hover:text-gold/90'
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* bottom block */}
        <div className="relative px-5 pb-7 pt-4 border-t border-gold/10">
          <div className="rounded-2xl overflow-hidden glass px-4 py-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-gold breathe shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[9px] uppercase tracking-[0.24em] text-gold/85 font-medium">
                  Members Only
                </p>
                <p className="font-accent italic text-[11px] text-cream/55 mt-0.5 leading-tight">
                  Curated in the hills
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-cream/45 hover:text-gold transition-colors duration-300"
          >
            <LogOut size={12} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header + Tabs */}
      <div className="lg:hidden sticky top-0 z-30 glass-soft border-b border-gold/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="B" className="h-8 w-auto" />
            <p className="font-accent italic text-[11px] text-gold/75 tracking-[0.3em]">ADMIN</p>
          </div>
          <button onClick={handleLogout} className="text-cream/50 hover:text-gold transition-colors">
            <LogOut size={17} />
          </button>
        </div>
        <div className="relative flex px-2 overflow-x-auto border-t border-gold/10">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={cn(
                'relative shrink-0 text-center px-4 py-3 text-[11px] uppercase tracking-[0.16em] font-medium transition-colors duration-300',
                activeTab === item.key ? 'text-gold' : 'text-cream/45 hover:text-cream/80'
              )}
            >
              {item.label}
              {activeTab === item.key && (
                <motion.div
                  layoutId="admin-tab-underline"
                  className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent, rgba(212,162,76,0.95), transparent)',
                    boxShadow: '0 0 10px rgba(212,162,76,0.5)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-1 min-h-screen overflow-y-auto relative">
        {/* ambient glow */}
        <div
          aria-hidden
          className="absolute top-[-15%] left-[30%] w-[60vw] h-[60vw] pointer-events-none aurora-1"
          style={{
            background:
              'radial-gradient(circle at center, rgba(212,162,76,0.07), transparent 60%)',
            filter: 'blur(90px)',
          }}
        />
        <div className="relative p-6 lg:p-12">
          <AdminStats key={refreshKey} activeTab={activeTab} />

          {/* Section heading */}
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.35em] text-gold/70">Manage</span>
              <h1
                className="font-display text-[32px] text-cream leading-tight mt-1 capitalize"
                style={{ fontVariationSettings: '"SOFT" 40, "opsz" 144, "wght" 500' }}
              >
                {activeTab === 'qr' ? 'QR Codes' : activeTab}
              </h1>
              <div className="hairline w-16 mt-2" />
            </div>
          </div>

          {activeTab === 'products' && <AdminProductsTab onCategoryChange={triggerRefresh} />}
          {activeTab === 'drinks' && <AdminDrinksTab onCategoryChange={triggerRefresh} />}
          {activeTab === 'events' && <AdminEventsTab />}
          {activeTab === 'papiers' && <AdminPapiersTab onCategoryChange={triggerRefresh} />}
          {activeTab === 'attributes' && <AdminAttributesTab onCategoryChange={triggerRefresh} />}
          {activeTab === 'qr' && <AdminQRTab />}
        </div>
      </main>
    </div>
  );
}

function AdminStats({ activeTab }: { activeTab: string }) {
  const { categories: prodCats } = useAdminCategories('products');
  const { categories: drinkCats } = useAdminCategories('drinks');
  const { events } = useAdminEvents();

  const totalProducts = (prodCats as CategoryWithProducts[]).reduce(
    (sum, c) => sum + (c.bakery_products?.length || 0), 0
  );
  const totalDrinks = (drinkCats as CategoryWithDrinks[]).reduce(
    (sum, c) => sum + (c.bakery_drinks?.length || 0), 0
  );
  const totalCategories = prodCats.length + drinkCats.length;
  const activeItems = (prodCats as CategoryWithProducts[]).reduce(
    (sum, c) => sum + (c.bakery_products?.filter(p => p.is_available)?.length || 0), 0
  ) + (drinkCats as CategoryWithDrinks[]).reduce(
    (sum, c) => sum + (c.bakery_drinks?.filter(d => d.is_available)?.length || 0), 0
  );

  const stats = [
    { label: 'Total Items', value: totalProducts + totalDrinks },
    { label: 'Categories', value: totalCategories },
    { label: 'Events', value: events.length },
    { label: 'Live Items', value: activeItems, pulse: true },
  ];

  if (activeTab === 'qr') return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
          className="relative rounded-2xl glass p-6 overflow-hidden"
        >
          {/* gold left border */}
          <div
            className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full"
            style={{
              background:
                'linear-gradient(180deg, transparent, rgba(212,162,76,0.85), transparent)',
              boxShadow: '0 0 10px rgba(212,162,76,0.45)',
            }}
          />
          <div className="flex items-center gap-2">
            <span
              className="font-display text-[42px] gold-shimmer leading-none"
              style={{ fontVariationSettings: '"SOFT" 30, "opsz" 144, "wght" 500' }}
            >
              {s.value}
            </span>
            {s.pulse && (
              <span className="w-1.5 h-1.5 rounded-full bg-gold breathe ml-1" />
            )}
          </div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-cream/55 mt-3 font-medium">
            {s.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
