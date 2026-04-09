import { useState, useEffect } from 'react';
import Modal from './Modal';
import MediaUploader from './MediaUploader';
import { useSections } from '@/hooks/useAdminData';
import type { Category } from '@/lib/types';

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { name: string; description: string; image_url: string | null; video_url: string | null; section_id: string | null }) => Promise<void>;
  editing?: Category | null;
}

export default function CategoryModal({ open, onClose, onSave, editing }: CategoryModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [sectionId, setSectionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { sections } = useSections();

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setImageUrl(editing?.image_url ?? null);
      setVideoUrl(editing?.video_url ?? null);
      setSectionId(editing?.section_id ?? null);
    }
  }, [open, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        image_url: imageUrl,
        video_url: videoUrl,
        section_id: sectionId,
      });
      onClose();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-sage/15 text-cream placeholder:text-sage/30 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 text-sm transition-colors';

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Category' : 'Add Category'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className={inputClass}
          autoFocus
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className={inputClass + ' resize-none'}
        />

        <MediaUploader
          value={imageUrl}
          onChange={setImageUrl}
          accept="image"
          label="Category Image"
        />

        <MediaUploader
          value={videoUrl}
          onChange={setVideoUrl}
          accept="video"
          label="Category Video"
        />

        <div className="space-y-1">
          <label className="text-xs text-sage/40 uppercase tracking-wider">Section (optional)</label>
          <select
            value={sectionId ?? ''}
            onChange={(e) => setSectionId(e.target.value || null)}
            className={inputClass}
          >
            <option value="">No section</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-4 rounded-2xl bg-terracotta text-cream font-display text-base font-semibold disabled:opacity-50 hover:bg-terracotta/90 transition-colors"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onClose} className="w-full py-3 rounded-2xl text-sm text-sage/50 hover:text-cream transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
