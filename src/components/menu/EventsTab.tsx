import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '@/hooks/useMenu';
import EventCard from './EventCard';
import { EventSkeleton } from './SkeletonCards';
import EmptyState from './EmptyState';
import MoreComingSoon from './MoreComingSoon';

export default function EventsTab() {
  const { events, loading } = useEvents();

  if (loading) return <EventSkeleton />;
  if (events.length === 0) return <EmptyState tab="events" />;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="events"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="px-6 md:px-8 lg:px-0 py-6 md:py-10 lg:pt-4 pb-40 md:pb-10"
      >
        <div className="md:hidden mb-6">
          <span className="text-[10px] uppercase tracking-[0.35em] text-gold/70">Upcoming</span>
          <h2 className="font-display text-[32px] text-cream mt-1" style={{ fontVariationSettings: '"SOFT" 50, "opsz" 144, "wght" 400' }}>What&apos;s On</h2>
          <div className="hairline w-20 mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {events.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
        <MoreComingSoon label="More nights soon" />
        <div style={{ height: '120px' }} aria-hidden="true" className="md:hidden" />
      </motion.div>
    </AnimatePresence>
  );
}
