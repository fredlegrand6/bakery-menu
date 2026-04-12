import { motion } from 'framer-motion';

export default function MoreComingSoon({ label = 'More pouring soon' }: { label?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-14 mb-6 flex flex-col items-center justify-center py-14 overflow-hidden"
    >
      {/* ambient gold glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(212,162,76,0.16) 0%, rgba(212,162,76,0.04) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
      {/* top hairline */}
      <div
        className="relative h-px w-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,162,76,0.7), transparent)',
        }}
      />
      <div className="relative mt-5 flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-gold breathe" />
        <span className="text-[10px] uppercase tracking-[0.42em] text-gold/85 font-medium">
          {label}
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-gold breathe" />
      </div>
      <p className="relative mt-3 font-accent italic text-[15px] text-cream/55">
        Curated in the hills of Ibiza
      </p>
      <div
        className="relative mt-5 h-px w-40"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(212,162,76,0.35), transparent)',
        }}
      />
    </motion.div>
  );
}
