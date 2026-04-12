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
      <div className="flex justify-end mb-2">
        <button
          onClick={() => setModal({ open: true, editing: null })}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold text-obsidian transition-all duration-300 hover:shadow-[0_10px_30px_-6px_rgba(212,162,76,0.6)]"
          style={{
            background: 'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 6px 20px -8px rgba(212,162,76,0.5)',
          }}
        >
          <Plus size={14} strokeWidth={2.5} /> Add Event
        </button>
      </div>

      {events.map((event) => {
        const { day, month } = formatDate(event.event_date);
        return (
          <div
            key={event.id}
            className="group/row flex items-center gap-4 p-4 rounded-xl bg-white/[0.015] border-b border-gold/10 border-l-2 border-l-transparent hover:border-l-gold/70 hover:bg-gold/[0.03] transition-all duration-300"
          >
            <div
              className="shrink-0 w-16 h-16 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(212,162,76,0.28), rgba(140,106,42,0.15))',
                boxShadow: 'inset 0 0 0 1px rgba(212,162,76,0.35)',
              }}
            >
              <span
                className="font-display text-[26px] leading-none text-cream"
                style={{ fontVariationSettings: '"opsz" 144, "wght" 500' }}
              >
                {day}
              </span>
              <span className="text-[9px] font-medium tracking-[0.22em] uppercase mt-1 text-gold/90">
                {month}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-display text-[17px] text-cream truncate"
                style={{ fontVariationSettings: '"SOFT" 30, "opsz" 144, "wght" 500' }}
              >
                {event.title}
              </p>
              {event.description && (
                <p className="font-accent italic text-[13px] text-cream/45 truncate mt-0.5">{event.description}</p>
              )}
              <div className="flex items-center gap-2 mt-1.5">
                {event.event_type && (
                  <span className="text-[9px] font-medium uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border border-sage/30 text-sage/90 bg-sage/[0.04]">
                    {eventTypeLabel(event.event_type)}
                  </span>
                )}
                {event.members_only && (
                  <span className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-[0.22em] px-2.5 py-1 rounded-full border border-gold/30 text-gold bg-gold/[0.05]">
                    <Lock size={8} /> Members
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => updateEvent(event.id, { is_active: !event.is_active })}
              className={cn(
                'text-[9px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border transition-all duration-300',
                event.is_active
                  ? 'bg-gold/15 text-gold border-gold/35'
                  : 'bg-white/[0.03] text-cream/35 border-cream/10'
              )}
            >
              {event.is_active ? 'Active' : 'Off'}
            </button>
            <button
              onClick={() => setModal({ open: true, editing: event })}
              className="text-cream/30 hover:text-gold transition-colors duration-300"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => handleDelete(event.id)}
              className="text-cream/30 hover:text-red-400 transition-colors duration-300"
            >
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
