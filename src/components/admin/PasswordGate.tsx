import { useState } from 'react';
import { motion } from 'framer-motion';

interface PasswordGateProps {
  onAuthenticated: () => void;
}

export default function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState('');
  const [shake, setShake] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      sessionStorage.setItem('bakery_admin', 'true');
      onAuthenticated();
    } else {
      setShake(true);
      setError(true);
      setTimeout(() => { setShake(false); setError(false); }, 600);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-obsidian p-4 overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-[-30%] left-[-10%] w-[80vw] h-[80vw] aurora-1 breathe"
          style={{
            background: 'radial-gradient(circle at center, rgba(212,162,76,0.2), transparent 60%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-[-30%] right-[-10%] w-[80vw] h-[80vw] aurora-2"
          style={{
            background: 'radial-gradient(circle at center, rgba(95,111,82,0.2), transparent 65%)',
            filter: 'blur(90px)',
          }}
        />
      </div>

      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm space-y-8 glass rounded-3xl px-8 py-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center justify-center gap-3"
          >
            <span className="h-px w-8 bg-gold/50" />
            <span className="uppercase tracking-[0.4em] text-[9px] font-medium text-gold/80">
              Admin Access
            </span>
            <span className="h-px w-8 bg-gold/50" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.3, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[40px] text-center leading-[0.95] mt-5"
            style={{
              fontVariationSettings: '"SOFT" 0, "opsz" 144, "wght" 700',
              letterSpacing: '0.02em',
            }}
          >
            <span className="gold-shimmer">THE&nbsp;BAKERY</span>
          </motion.h1>
          <div
            className="mt-4 h-px w-20 mx-auto"
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(212,162,76,0.7), transparent)',
            }}
          />
          <p className="font-accent italic text-[13px] text-cream/55 mt-4 tracking-wide">
            members only
          </p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={`w-full px-5 py-4 rounded-2xl bg-white/[0.03] border text-cream placeholder:text-cream/30 focus:outline-none transition-all duration-300 text-[14px] tracking-wide ${
            error
              ? 'border-red-500/60'
              : 'border-gold/20 focus:border-gold/60 focus:bg-gold/[0.04] focus:shadow-[0_0_0_3px_rgba(212,162,76,0.12)]'
          }`}
          autoFocus
        />
        <button
          type="submit"
          className="w-full py-4 rounded-2xl text-obsidian text-[12px] uppercase tracking-[0.3em] font-semibold transition-all duration-300 hover:shadow-[0_14px_36px_-8px_rgba(212,162,76,0.6)]"
          style={{
            background:
              'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
            boxShadow:
              'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 8px 22px -8px rgba(212,162,76,0.5)',
          }}
        >
          Enter
        </button>
      </motion.form>
    </div>
  );
}
