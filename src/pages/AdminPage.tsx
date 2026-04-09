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
    <div className="min-h-screen w-screen flex flex-col lg:flex-row bg-[#252b1e]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 h-screen sticky top-0 bg-[#1e2318] border-r border-sage/[0.08] overflow-hidden">
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url(&quot;data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)] bg-repeat bg-[length:256px_256px]" />

        {/* Logo */}
        <div className="relative flex flex-col items-center py-8 px-5 border-b border-sage/[0.08]">
          <img src="/favicon.svg" alt="B" className="h-16 w-auto" />
          <div className="w-6 h-px bg-terracotta my-2" />
          <p className="font-accent italic text-sm text-sage/40 tracking-widest">Admin</p>
        </div>

        {/* Nav */}
        <nav className="relative flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={cn(
                  'w-full flex items-center gap-3 px-5 py-4 rounded-xl text-base font-medium transition-all duration-200',
                  active
                    ? 'bg-white/5 text-cream border-l-2 border-l-terracotta'
                    : 'text-sage/40 hover:text-sage/70 hover:bg-white/[0.02] border-l-2 border-l-transparent'
                )}
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="relative px-5 py-4 border-t border-sage/[0.08]">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-sage/50" />
            <span className="text-xs text-sage/40">Logged in</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-sage/40 hover:text-cream transition-colors duration-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header + Tabs */}
      <div className="lg:hidden sticky top-0 z-30 bg-[rgba(30,35,24,0.97)] backdrop-blur-xl border-b border-sage/[0.08]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="B" className="h-8 w-auto" />
            <p className="font-accent italic text-sm text-sage/40">Admin</p>
          </div>
          <button onClick={handleLogout} className="text-sage/40 hover:text-cream transition-colors">
            <LogOut size={18} />
          </button>
        </div>
        <div className="relative flex px-4 border-t border-sage/[0.06]">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={cn(
                'relative flex-1 text-center px-3 py-3 text-sm font-medium transition-colors duration-300 -mb-px',
                activeTab === item.key ? 'text-cream' : 'text-sage/40 hover:text-sage/70'
              )}
            >
              {item.label}
              {activeTab === item.key && (
                <motion.div
                  layoutId="admin-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-terracotta"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        <div className="p-6 lg:p-12">
          {/* Stats bar */}
          <AdminStats key={refreshKey} activeTab={activeTab} />

          {/* Section heading */}
          <p className="text-xs text-sage/30 uppercase tracking-widest mb-4">
            {activeTab === 'qr' ? 'QR CODES' : activeTab.toUpperCase()}
          </p>

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
    { label: 'Total Products', value: totalProducts + totalDrinks },
    { label: 'Categories', value: totalCategories },
    { label: 'Events', value: events.length },
    { label: 'Active Items', value: activeItems, dot: true },
  ];

  // Only show on matching tabs or always — keep it simple, always show
  if (activeTab === 'qr') return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-[#1e2318] rounded-2xl p-6 border border-sage/[0.06]">
          <div className="flex items-center gap-2">
            <span className="font-display text-4xl text-cream">{s.value}</span>
            {s.dot && <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />}
          </div>
          <p className="text-sm text-sage/50 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
