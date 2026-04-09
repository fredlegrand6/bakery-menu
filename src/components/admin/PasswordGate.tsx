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
    <div className="min-h-screen flex items-center justify-center bg-olive-dark p-4">
      <motion.form
        onSubmit={handleSubmit}
        animate={shake ? { x: [0, -12, 12, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold text-cream tracking-wide">
            THE BAKERY
          </h1>
          <div className="flex justify-center my-3">
            <div className="w-12 h-px bg-terracotta" />
          </div>
          <p className="font-accent text-lg italic text-sage tracking-widest">
            ADMIN ACCESS
          </p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className={`w-full px-5 py-4 rounded-2xl bg-transparent border text-cream placeholder:text-sage/30 focus:outline-none focus:ring-0 transition-all duration-300 text-base ${
            error
              ? 'border-red-500/60'
              : 'border-sage/20 focus:border-terracotta focus:shadow-[0_0_0_3px_rgba(196,102,31,0.15)]'
          }`}
          autoFocus
        />
        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-terracotta text-cream font-display text-lg font-semibold hover:bg-terracotta/85 transition-colors duration-300"
        >
          Enter
        </button>
      </motion.form>
    </div>
  );
}
