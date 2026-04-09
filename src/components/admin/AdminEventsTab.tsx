import { useState } from 'react';
import { Plus, Pencil, Trash2, Lock } from 'lucide-react';
import { useAdminEvents } from '@/hooks/useAdminData';
import { formatDate, eventTypeLabel, cn } from '@/lib/utils';
import EventModal from './EventModal';
import type { BakeryEvent } from '@/lib/types';

export default function AdminEventsTab() {
  const { events, updateEvent, deleteEvent, addEvent } = useAdminEvents();
  const [modal, setModal] = useState<{ open: boolean; editing: BakeryEvent | null }>({ open: false, editing: null });

  const handleSave = async (data: Omit<BakeryEvent, 'id' | 'created_at' | 'updated_at'>) => {
    if (modal.editing) {
      await updateEvent(modal.editing.id, data);
    } else {
      await addEvent(data);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this event?')) return;
    await deleteEvent(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button
          onClick={() => setModal({ open: true, editing: null })}
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-terracotta text-cream font-medium hover:bg-terracotta/85 transition-colors duration-300"
        >
          <Plus size={14} /> Add Event
        </button>
      </div>

      {events.map((event) => {
        const { day, month } = formatDate(event.event_date);
        return (
          <div key={event.id} className="flex items-center gap-4 p-4 rounded-2xl border border-sage/[0.08] border-l-4 border-l-terracotta bg-black/20">
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-terracotta/80 flex flex-col items-center justify-center text-cream">
              <span className="text-2xl font-bold leading-none">{day}</span>
              <span className="text-[9px] font-semibold tracking-wider">{month}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-cream font-medium truncate">{event.title}</p>
              {event.description && (
                <p className="text-sm text-sage/40 truncate mt-0.5">{event.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                {event.event_type && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage/15 text-sage border border-sage/10">
                    {eventTypeLabel(event.event_type)}
                  </span>
                )}
                {event.members_only && (
                  <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-terracotta/15 text-terracotta border border-terracotta/20">
                    <Lock size={8} /> Members
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => updateEvent(event.id, { is_active: !event.is_active })}
              className={cn(
                'text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full transition-colors duration-300',
                event.is_active ? 'bg-sage/15 text-sage' : 'bg-white/5 text-sage/30'
              )}
            >
              {event.is_active ? 'Active' : 'Off'}
            </button>
            <button onClick={() => setModal({ open: true, editing: event })} className="text-sage/30 hover:text-cream transition-colors duration-300">
              <Pencil size={14} />
            </button>
            <button onClick={() => handleDelete(event.id)} className="text-sage/30 hover:text-red-400 transition-colors duration-300">
              <Trash2 size={14} />
            </button>
          </div>
        );
      })}

      <EventModal
        open={modal.open}
        onClose={() => setModal({ open: false, editing: null })}
        onSave={handleSave}
        editing={modal.editing}
      />
    </div>
  );
}
