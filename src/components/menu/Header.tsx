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

      <div className="relative flex flex-col items-center justify-center pt-14 pb-14 md:pt-20 md:pb-20 px-6">
        {/* Logo wordmark — invert + lighten blend to knock out the white bg */}
        <motion.img
          src="/logo-wordmark.png"
          alt="The Bakery Ibiza"
          initial={{ opacity: 0, y: 14, filter: 'blur(10px) invert(1)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px) invert(1)' }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-full max-w-[520px] h-auto select-none pointer-events-none"
          style={{
            mixBlendMode: 'lighten',
            objectFit: 'contain',
          }}
        />

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
