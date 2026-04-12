import { motion } from 'framer-motion';

// deterministic particle positions — avoids SSR mismatch and re-renders
const PARTICLES = Array.from({ length: 28 }, (_, i) => {
  const left = (i * 37) % 100;
  const delay = (i * 0.47) % 14;
  const dur = 10 + ((i * 1.7) % 10);
  const drift = (i % 2 === 0 ? 1 : -1) * (8 + ((i * 3) % 22));
  const wide = i % 5 === 0;
  return { left, delay, dur, drift, wide };
});

export default function DesktopHero() {
  return (
    <section className="relative w-full h-[40vh] min-h-[380px] overflow-hidden isolate">
      {/* Aurora background layers */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-obsidian" />

        {/* drifting gold cloud */}
        <div
          className="absolute -top-[40%] left-[-10%] w-[90%] h-[160%] aurora-1 breathe"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(212,162,76,0.28) 0%, rgba(196,102,31,0.1) 35%, transparent 65%)',
            filter: 'blur(70px)',
          }}
        />
        {/* drifting olive cloud */}
        <div
          className="absolute -bottom-[40%] right-[-15%] w-[95%] h-[160%] aurora-2"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(95,111,82,0.3) 0%, rgba(169,179,136,0.08) 45%, transparent 70%)',
            filter: 'blur(90px)',
          }}
        />
        {/* center warm glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[60vw] h-[30vh] breathe"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(232,193,122,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, transparent 0%, transparent 50%, rgba(10,11,7,0.75) 100%)',
          }}
        />

        {/* bottom fade to page bg */}
        <div
          className="absolute inset-x-0 bottom-0 h-40"
          style={{
            background:
              'linear-gradient(to bottom, transparent, rgba(10,11,7,1))',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 -z-[5] pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`particle ${p.wide ? 'particle-wide' : ''}`}
            style={
              {
                left: `${p.left}%`,
                bottom: 0,
                '--x': `${p.drift}px`,
                '--dur': `${p.dur}s`,
                '--delay': `${p.delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-10">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-4"
        >
          <span className="h-px w-12 bg-gold/50" />
          <span className="uppercase tracking-[0.5em] text-[11px] font-medium text-gold/85">
            A Private Members Club · Est. Ibiza
          </span>
          <span className="h-px w-12 bg-gold/50" />
        </motion.div>

        <motion.img
          src="/logo-wordmark.png"
          alt="The Bakery Ibiza"
          initial={{ opacity: 0, y: 22, filter: 'blur(14px) invert(1)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px) invert(1)' }}
          transition={{ duration: 1.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          draggable={false}
          className="w-full max-w-[1000px] h-auto select-none pointer-events-none mt-4"
          style={{
            mixBlendMode: 'lighten',
            objectFit: 'contain',
          }}
        />

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 h-[2px] w-24 origin-center rounded-full"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(196,102,31,0.9), rgba(232,193,122,0.9), transparent)',
            boxShadow: '0 0 14px rgba(212,162,76,0.4)',
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.75, ease: 'easeOut' }}
          className="font-accent italic text-lg text-cream/65 mt-4 tracking-wide"
        >
          cultivated in the hills — served in silence
        </motion.p>
      </div>
    </section>
  );
}
