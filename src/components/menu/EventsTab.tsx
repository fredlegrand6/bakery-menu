import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '@/hooks/useMenu';
import EventCard from './EventCard';
import { EventSkeleton } from './SkeletonCards';
import EmptyState from './EmptyState';

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
        className="px-6 md:px-12 lg:px-16 py-6 md:py-10 pb-40 md:pb-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3, ease: 'easeOut' }}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
        <div style={{ height: '120px' }} aria-hidden="true" className="md:hidden" />
      </motion.div>
    </AnimatePresence>
  );
}
