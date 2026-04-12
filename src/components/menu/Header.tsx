import { motion } from 'framer-motion';

export default function Header() {
  return (
    <section className="relative w-full overflow-hidden isolate">
      {/* Ambient aurora — slow, warm, gold-tinted */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-obsidian" />
        <div
          className="absolute -top-1/3 -left-1/4 w-[120%] h-[120%] rounded-full aurora-1 breathe"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(212,162,76,0.22) 0%, rgba(196,102,31,0.08) 35%, transparent 65%)',
            filter: 'blur(60px)',
          }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 w-[110%] h-[110%] rounded-full aurora-2"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(95,111,82,0.28) 0%, rgba(169,179,136,0.06) 45%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 40%, transparent 0%, transparent 40%, rgba(10,11,7,0.85) 100%)',
          }}
        />
      </div>

      <div className="relative flex flex-col items-center justify-center pt-16 pb-16 md:pt-24 md:pb-24 px-6">
        {/* THE BAKERY — hero wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-center leading-[0.92]"
          style={{
            fontVariationSettings: '"SOFT" 0, "opsz" 144, "wght" 700',
            letterSpacing: '0.015em',
            fontSize: 'clamp(40px, 10vw, 76px)',
          }}
        >
          <span className="gold-shimmer">THE&nbsp;BAKERY</span>
        </motion.h1>

        {/* terracotta accent bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 h-[2px] w-16 origin-center rounded-full"
          style={{
            background:
              'linear-gradient(90deg, rgba(196,102,31,0), rgba(196,102,31,0.95) 30%, rgba(232,193,122,0.95) 70%, rgba(196,102,31,0))',
            boxShadow: '0 0 12px rgba(212,162,76,0.35)',
          }}
        />

        {/* IBIZA. — subtitle, spaced */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75, ease: 'easeOut' }}
          className="font-display mt-4 text-cream/75 italic"
          style={{
            fontVariationSettings: '"opsz" 144, "wght" 400',
            letterSpacing: '0.52em',
            fontSize: 'clamp(14px, 2.8vw, 18px)',
            paddingLeft: '0.52em',
          }}
        >
          IBIZA.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
          className="font-accent italic text-base md:text-lg text-cream/65 mt-4 tracking-wide"
        >
          a private members club — cultivated in the hills
        </motion.p>

        {/* small members-only badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-7 flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/20 bg-gold/[0.04] backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-gold breathe" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-gold/85 font-medium">
            Members Menu
          </span>
        </motion.div>
      </div>

      {/* bottom hairline */}
      <div className="hairline mx-6 md:mx-12" />
    </section>
  );
}
