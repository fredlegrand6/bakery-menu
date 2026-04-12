import { Leaf, Wine, Calendar, Scroll, SlidersHorizontal } from 'lucide-react';
import type { MenuTab } from './TabBar';

const config: Record<MenuTab, { icon: typeof Leaf; message: string }> = {
  products: { icon: Leaf, message: 'Menu items coming soon...' },
  drinks: { icon: Wine, message: 'Drink menu coming soon...' },
  events: { icon: Calendar, message: 'No upcoming events right now.' },
  papiers: { icon: Scroll, message: 'Papiers & accessories coming soon...' },
  attributes: { icon: SlidersHorizontal, message: 'Attributes coming soon...' },
};

export default function EmptyState({ tab }: { tab: MenuTab }) {
  const { icon: Icon, message } = config[tab];
  return (
    <div className="flex flex-col items-center justify-center py-24 text-gold/55">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-2xl bg-gold/20 breathe" />
        <Icon size={44} strokeWidth={1} className="relative" />
      </div>
      <p className="mt-5 font-accent italic text-[15px] text-cream/60">{message}</p>
    </div>
  );
}
