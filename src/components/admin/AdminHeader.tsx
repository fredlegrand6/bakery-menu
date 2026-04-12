import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass-soft border-b border-gold/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="B" className="h-8 w-auto" />
          <p className="font-accent italic text-[11px] text-gold/75 tracking-[0.3em]">ADMIN</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-cream/50 hover:text-gold transition-colors duration-300"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
