import { motion } from 'framer-motion';
import { formatDate, eventTypeLabel } from '@/lib/utils';
import type { BakeryEvent } from '@/lib/types';

interface EventCardProps {
  event: BakeryEvent;
}

export default function EventCard({ event }: EventCardProps) {
  const { day, month, weekday } = formatDate(event.event_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex gap-4 p-5 rounded-2xl bg-gradient-to-br from-white/[0.05] to-white/[0.02] border border-sage/[0.08]"
    >
      <div className="shrink-0 w-20 h-20 rounded-xl bg-terracotta flex flex-col items-center justify-center text-cream shadow-[0_4px_16px_rgba(196,102,31,0.25)]">
        <span className="text-2xl font-bold leading-none">{day}</span>
        <span className="text-[10px] font-semibold tracking-wider mt-0.5">{month}</span>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          {event.event_type && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-sage/15 text-sage border border-sage/10">
              {eventTypeLabel(event.event_type)}
            </span>
          )}
          {event.members_only && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-terracotta/15 text-terracotta border border-terracotta/20">
              Members Only
            </span>
          )}
        </div>
        <h3 className="font-display text-xl font-bold text-cream">{event.title}</h3>
        <p className="text-xs text-cream/40">
          {weekday}{event.event_time ? ` · ${event.event_time}` : ''}
        </p>
        {event.description && (
          <p className="text-sm text-cream/55 line-clamp-2">{event.description}</p>
        )}
      </div>
    </motion.div>
  );
}
