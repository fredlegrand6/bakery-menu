import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from './Modal';
import MediaDropZone from './MediaDropZone';
import type { Product, ProductVariant } from '@/lib/types';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string | null;
    effects: string[] | null;
    image_url: string | null;
    video_url: string | null;
    variants: ProductVariant[];
    category_id: string;
    is_available: boolean;
    display_order: number;
  }) => Promise<void>;
  editing?: Product | null;
  categoryId: string;
  nextOrder: number;
}

export default function ProductModal({ open, onClose, onSave, editing, categoryId, nextOrder }: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [effects, setEffects] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setEffects(editing?.effects?.join(', ') ?? '');
      setImageUrl(editing?.image_url ?? '');
      setVideoUrl(editing?.video_url ?? '');
      setVariants(editing?.variants ?? []);
      setNewLabel('');
      setNewPrice('');
    }
  }, [open, editing]);

  const addVariant = () => {
    if (!newLabel.trim() || !newPrice) return;
    setVariants([...variants, { label: newLabel.trim(), price_cents: Math.round(parseFloat(newPrice) * 100) }]);
    setNewLabel('');
    setNewPrice('');
  };

  const removeVariant = (i: number) => {
    setVariants(variants.filter((_, idx) => idx !== i));
  };

  const updateVariant = (i: number, field: 'label' | 'price_cents', value: string) => {
    const updated = [...variants];
    if (field === 'label') updated[i] = { ...updated[i], label: value };
    else updated[i] = { ...updated[i], price_cents: Math.round(parseFloat(value) * 100) || 0 };
    setVariants(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);

    // Auto-add any pending variant the user typed but didn't click + for
    let finalVariants = [...variants];
    if (newLabel.trim() && newPrice) {
      finalVariants = [...finalVariants, {
        label: newLabel.trim(),
        price_cents: Math.round(parseFloat(newPrice) * 100),
      }];
    }

    const effectsArr = effects.trim() ? effects.split(',').map((s) => s.trim()).filter(Boolean) : null;
    await onSave({
      name: name.trim(),
      description: description.trim() || null,
      effects: effectsArr,
      image_url: imageUrl.trim() || null,
      video_url: videoUrl.trim() || null,
      variants: finalVariants,
      category_id: categoryId,
      is_available: editing?.is_available ?? true,
      display_order: editing?.display_order ?? nextOrder,
    });
    setSaving(false);
    onClose();
  };

  const inputClass = 'w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-gold/15 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/55 focus:bg-gold/[0.04] focus:shadow-[0_0_0_3px_rgba(212,162,76,0.12)] text-[13px] transition-all duration-300';
  const variantInputClass = 'px-4 py-2.5 rounded-xl bg-white/[0.03] border border-gold/15 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/55 focus:bg-gold/[0.04] text-[13px] transition-all duration-300';

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" className={inputClass} autoFocus />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className={inputClass + ' resize-none'} />
        <input value={effects} onChange={(e) => setEffects(e.target.value)} placeholder="Effects (comma separated)" className={inputClass} />
        <MediaDropZone accept="image" label="Product Image" onUrl={(url) => setImageUrl(url)} currentUrl={imageUrl || undefined} />
        <MediaDropZone
          accept="video"
          label="Product Video (optional)"
          onUrl={(url) => setVideoUrl(url)}
          currentUrl={videoUrl || undefined}
          onClear={() => setVideoUrl('')}
        />

        <div className="space-y-2">
          <label className="text-[10px] text-gold/70 uppercase tracking-[0.22em] font-medium">Variants</label>
          <p className="font-accent italic text-[12px] text-cream/45">Add each size separately — e.g. 1g · 3.5g · 7g · 1 pre-roll</p>

          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <input
                  value={v.label}
                  onChange={(e) => updateVariant(i, 'label', e.target.value)}
                  placeholder="Amount (e.g. 1g, 3.5g)"
                  className={variantInputClass + ' w-full'}
                />
              </div>
              <div className="w-28 shrink-0">
                <input
                  type="number"
                  step="0.01"
                  value={(v.price_cents / 100).toFixed(2)}
                  onChange={(e) => updateVariant(i, 'price_cents', e.target.value)}
                  placeholder="€"
                  className={variantInputClass + ' w-full'}
                />
              </div>
              <button type="button" onClick={() => removeVariant(i)} className="shrink-0 text-cream/40 hover:text-red-400 transition-colors">
                <X size={16} />
              </button>
            </div>
          ))}

          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <input
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="Amount (e.g. 1g)"
                className={variantInputClass + ' w-full'}
              />
            </div>
            <div className="w-28 shrink-0">
              <input
                type="number"
                step="0.01"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="€ price"
                className={variantInputClass + ' w-full'}
              />
            </div>
            <button type="button" onClick={addVariant} className="shrink-0 text-gold/70 hover:text-gold transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !name.trim()}
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
