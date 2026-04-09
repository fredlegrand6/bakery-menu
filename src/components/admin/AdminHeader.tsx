import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[rgba(42,48,32,0.97)] backdrop-blur-xl border-b border-sage/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/favicon.svg" alt="B" className="h-8 w-auto" />
          <p className="font-accent italic text-sm text-sage/40">Admin</p>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-sage/40 hover:text-cream transition-colors duration-300"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline text-sm">Logout</span>
        </button>
      </div>
    </header>
  );
}
