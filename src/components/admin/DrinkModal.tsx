import { useState, useEffect } from 'react';
import Modal from './Modal';
import MediaDropZone from './MediaDropZone';
import type { Drink } from '@/lib/types';

interface DrinkModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string | null;
    price_cents: number;
    image_url: string | null;
    category_id: string;
    is_available: boolean;
    display_order: number;
  }) => Promise<void>;
  editing?: Drink | null;
  categoryId: string;
  nextOrder: number;
}

export default function DrinkModal({ open, onClose, onSave, editing, categoryId, nextOrder }: DrinkModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setPrice(editing ? (editing.price_cents / 100).toFixed(2) : '');
      setImageUrl(editing?.image_url ?? '');
    }
  }, [open, editing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      description: description.trim() || null,
      price_cents: Math.round(parseFloat(price || '0') * 100),
      image_url: imageUrl.trim() || null,
      category_id: categoryId,
      is_available: editing?.is_available ?? true,
      display_order: editing?.display_order ?? nextOrder,
    });
    setSaving(false);
    onClose();
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-white/[0.05] border border-sage/15 text-cream placeholder:text-sage/30 focus:outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 text-sm transition-colors';

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Drink' : 'Add Drink'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Drink name" className={inputClass} autoFocus />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className={inputClass + ' resize-none'} />
        <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (€)" className={inputClass} />
        <MediaDropZone accept="image" label="Drink Image" onUrl={(url) => setImageUrl(url)} currentUrl={imageUrl || undefined} />
        <div className="flex flex-col gap-2 pt-2">
          <button type="submit" disabled={saving || !name.trim()} className="w-full py-4 rounded-2xl bg-terracotta text-cream font-display text-base font-semibold disabled:opacity-50 hover:bg-terracotta/90 transition-colors">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button type="button" onClick={onClose} className="w-full py-3 rounded-2xl text-sm text-sage/50 hover:text-cream transition-colors">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}
