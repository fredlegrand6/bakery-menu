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
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-[#1e2318] rounded-t-3xl sm:rounded-3xl p-6 border border-sage/10 shadow-2xl shadow-black/50"
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-display text-xl text-cream font-bold">{title}</h2>
              <button onClick={onClose} className="text-sage/40 hover:text-cream transition-colors duration-300">
                <X size={20} />
              </button>
            </div>
            <div className="h-px bg-terracotta/30 mb-6" />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
