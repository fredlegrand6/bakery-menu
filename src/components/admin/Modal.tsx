import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div
            className="absolute inset-0 backdrop-blur-md"
            style={{ backgroundColor: 'rgba(10, 11, 7, 0.78)' }}
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto glass rounded-t-3xl sm:rounded-3xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[9px] uppercase tracking-[0.32em] text-gold/70">Admin</span>
                <h2
                  className="font-display text-xl text-cream mt-0.5"
                  style={{ fontVariationSettings: '"SOFT" 30, "opsz" 144, "wght" 500' }}
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.03] text-gold/55 ring-1 ring-gold/15 hover:bg-gold/10 hover:text-gold hover:ring-gold/40 transition-all duration-300"
              >
                <X size={16} />
              </button>
            </div>
            <div className="hairline mb-6" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
