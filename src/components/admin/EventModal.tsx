import { useState, useEffect } from 'react';
import Modal from './Modal';
import MediaDropZone from './MediaDropZone';
import type { BakeryEvent, EventType } from '@/lib/types';

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'sunset_session', label: 'Sunset Session' },
  { value: 'dj_night', label: 'DJ Night' },
  { value: '420_special', label: '420 Special' },
  { value: 'social', label: 'Social' },
  { value: 'full_moon', label: 'Full Moon' },
  { value: 'special', label: 'Special Event' },
];

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<BakeryEvent, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  editing?: BakeryEvent | null;
}

export default function EventModal({ open, onClose, onSave, editing }: EventModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventType, setEventType] = useState<string>('social');
  const [membersOnly, setMembersOnly] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(editing?.title ?? '');
      setDescription(editing?.description ?? '');
      setEventDate(editing?.event_date ?? '');
      setEventTime(editing?.event_time ?? '');
      setEventType(editing?.event_type ?? 'social');
      setMembersOnly(editing?.members_only ?? false);
      setImageUrl(editing?.image_url ?? '');
      setVideoUrl(editing?.video_url ?? '');
      setIsActive(editing?.is_active ?? true);
    }
  }, [open, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventDate) return;
    setSaving(true);
    await onSave({
      title: title.trim(),
      description: description.trim() || null,
      event_date: eventDate,
      event_time: eventTime.trim() || null,
      event_type: eventType,
      members_only: membersOnly,
      image_url: imageUrl.trim() || null,
      video_url: videoUrl.trim() || null,
      is_active: isActive,
    });
    setSaving(false);
    onClose();
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-gold/15 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/55 focus:bg-gold/[0.04] focus:shadow-[0_0_0_3px_rgba(212,162,76,0.12)] text-[13px] transition-all duration-300';

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Event' : 'Add Event'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className={inputClass} autoFocus />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className={inputClass + ' resize-none'} />
        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={inputClass} />
          <input value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="Time (e.g. 20:00)" className={inputClass} />
        </div>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)} className={inputClass}>
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <MediaDropZone accept="image" label="Event Image" onUrl={(url) => setImageUrl(url)} currentUrl={imageUrl || undefined} />
        <MediaDropZone accept="video" label="Event Video (optional)" onUrl={(url) => setVideoUrl(url)} currentUrl={videoUrl || undefined} />
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-sage cursor-pointer">
            <input type="checkbox" checked={membersOnly} onChange={(e) => setMembersOnly(e.target.checked)} className="accent-terracotta" />
            Members Only
          </label>
          <label className="flex items-center gap-2 text-sm text-sage cursor-pointer">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-terracotta" />
            Active
          </label>
        </div>
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !title.trim() || !eventDate}
            className="w-full py-4 rounded-2xl text-obsidian text-[12px] uppercase tracking-[0.28em] font-semibold disabled:opacity-40 transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(212,162,76,0.5)]"
            style={{
              background: 'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
              boxShadow: 'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 6px 20px -8px rgba(212,162,76,0.5)',
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onClose} className="w-full py-3 rounded-2xl text-[11px] uppercase tracking-[0.22em] text-cream/45 hover:text-gold transition-colors duration-300">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}
