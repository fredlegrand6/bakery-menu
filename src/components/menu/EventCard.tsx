import { motion } from 'framer-motion';
import { formatDate, eventTypeLabel } from '@/lib/utils';
import type { BakeryEvent } from '@/lib/types';

interface EventCardProps {
  event: BakeryEvent;
  index?: number;
}

export default function EventCard({ event, index = 0 }: EventCardProps) {
  const { day, month, weekday } = formatDate(event.event_date);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.95, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="group relative flex gap-5 p-5 rounded-[22px] glass overflow-hidden"
    >
      {/* date stamp */}
      <div className="shrink-0 w-[76px] h-[88px] rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(212,162,76,0.28) 0%, rgba(140,106,42,0.15) 100%)',
          }}
        />
        <div
          className="absolute inset-0 ring-1 ring-inset rounded-2xl"
          style={{ boxShadow: 'inset 0 0 0 1px rgba(212,162,76,0.35)' }}
        />
        <span
          className="relative font-display text-[32px] leading-none text-cream"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}
        >
          {day}
        </span>
        <span className="relative text-[9px] font-medium tracking-[0.25em] uppercase mt-1 text-gold/90">
          {month}
        </span>
      </div>

      {/* body */}
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          {event.event_type && (
            <span className="text-[9px] font-medium uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border border-sage/30 text-sage/90 bg-sage/[0.04]">
              {eventTypeLabel(event.event_type)}
            </span>
          )}
          {event.members_only && (
            <span className="text-[9px] font-medium uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border border-gold/30 text-gold bg-gold/[0.05]">
              Members Only
            </span>
          )}
        </div>
        <h3
          className="font-display text-[22px] text-cream leading-tight"
          style={{ fontVariationSettings: '"SOFT" 35, "opsz" 144, "wght" 500' }}
        >
          {event.title}
        </h3>
        <p className="text-[11px] uppercase tracking-[0.2em] text-cream/45">
          {weekday}
          {event.event_time ? ` · ${event.event_time}` : ''}
        </p>
        {event.description && (
          <p className="font-accent italic text-[14px] text-cream/60 line-clamp-2 leading-snug">
            {event.description}
          </p>
        )}
      </div>
    </motion.article>
  );
}
