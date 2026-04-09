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
    <div className="flex flex-col items-center justify-center py-20 text-sage/50">
      <Icon size={48} strokeWidth={1} />
      <p className="mt-4 text-sm">{message}</p>
    </div>
  );
}
