import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Modal from './Modal';
import MediaDropZone from './MediaDropZone';
import type { Product, ProductVariant, ProductType } from '@/lib/types';

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
    product_type: ProductType | null;
    origin: string | null;
    thc_percentage: number | null;
    cbd_percentage: number | null;
    tasting_notes: string[] | null;
  }) => Promise<void>;
  editing?: Product | null;
  categoryId: string;
  nextOrder: number;
}

const PRODUCT_TYPES: ProductType[] = ['Sativa', 'Indica', 'Hybrid'];

export default function ProductModal({
  open,
  onClose,
  onSave,
  editing,
  categoryId,
  nextOrder,
}: ProductModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [effects, setEffects] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [productType, setProductType] = useState<ProductType | null>(null);
  const [origin, setOrigin] = useState('');
  const [thc, setThc] = useState('');
  const [cbd, setCbd] = useState('');
  const [tastingNotes, setTastingNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setDescription(editing?.description ?? '');
      setEffects(editing?.effects?.join(', ') ?? '');
      setImageUrl(editing?.image_url ?? '');
      setVideoUrl(editing?.video_url ?? '');
      setVariants(editing?.variants ?? []);
      setProductType(editing?.product_type ?? null);
      setOrigin(editing?.origin ?? '');
      setThc(editing?.thc_percentage != null ? String(editing.thc_percentage) : '');
      setCbd(editing?.cbd_percentage != null ? String(editing.cbd_percentage) : '');
      setTastingNotes(editing?.tasting_notes?.join(', ') ?? '');
      setNewLabel('');
      setNewPrice('');
    }
  }, [open, editing]);

  const addVariant = () => {
    if (!newLabel.trim() || !newPrice) return;
    setVariants([
      ...variants,
      { label: newLabel.trim(), price_cents: Math.round(parseFloat(newPrice) * 100) },
    ]);
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

    let finalVariants = [...variants];
    if (newLabel.trim() && newPrice) {
      finalVariants = [
        ...finalVariants,
        { label: newLabel.trim(), price_cents: Math.round(parseFloat(newPrice) * 100) },
      ];
    }

    const splitCsv = (s: string) =>
      s.trim() ? s.split(',').map((x) => x.trim()).filter(Boolean) : null;

    const parseNum = (s: string): number | null => {
      if (!s.trim()) return null;
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : null;
    };

    await onSave({
      name: name.trim(),
      description: description.trim() || null,
      effects: splitCsv(effects),
      image_url: imageUrl.trim() || null,
      video_url: videoUrl.trim() || null,
      variants: finalVariants,
      category_id: categoryId,
      is_available: editing?.is_available ?? true,
      display_order: editing?.display_order ?? nextOrder,
      product_type: productType,
      origin: origin.trim() || null,
      thc_percentage: parseNum(thc),
      cbd_percentage: parseNum(cbd),
      tasting_notes: splitCsv(tastingNotes),
    });
    setSaving(false);
    onClose();
  };

  const inputClass =
    'w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-gold/15 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/55 focus:bg-gold/[0.04] focus:shadow-[0_0_0_3px_rgba(212,162,76,0.12)] text-[13px] transition-all duration-300';
  const variantInputClass =
    'px-4 py-2.5 rounded-xl bg-white/[0.03] border border-gold/15 text-cream placeholder:text-cream/30 focus:outline-none focus:border-gold/55 focus:bg-gold/[0.04] text-[13px] transition-all duration-300';
  const sectionLabelClass =
    'text-[10px] text-gold/70 uppercase tracking-[0.22em] font-medium block mb-2';

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit Product' : 'Add Product'}>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className={sectionLabelClass}>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sunset Sherbet"
            className={inputClass}
            autoFocus
          />
        </div>

        {/* Description / Story */}
        <div>
          <label className={sectionLabelClass}>Description / Story</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="The story behind this strain — origin, character, what makes it special..."
            rows={5}
            className={inputClass + ' resize-none leading-relaxed'}
          />
        </div>

        {/* Product Type segmented control */}
        <div>
          <label className={sectionLabelClass}>Type</label>
          <div className="flex gap-2">
            {PRODUCT_TYPES.map((t) => {
              const active = productType === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setProductType(active ? null : t)}
                  className={
                    'flex-1 py-3 rounded-2xl text-[11px] uppercase tracking-[0.22em] font-medium transition-all duration-300 ' +
                    (active
                      ? 'text-obsidian shadow-[0_8px_22px_-10px_rgba(212,162,76,0.6)]'
                      : 'bg-white/[0.03] border border-gold/15 text-cream/55 hover:text-gold hover:border-gold/40')
                  }
                  style={
                    active
                      ? {
                          background:
                            'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
                          boxShadow:
                            'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 16px -6px rgba(212,162,76,0.45)',
                        }
                      : undefined
                  }
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Origin */}
        <div>
          <label className={sectionLabelClass}>Origin</label>
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="e.g. California · Amsterdam · Spain"
            className={inputClass}
          />
        </div>

        {/* THC / CBD grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={sectionLabelClass}>THC %</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={thc}
              onChange={(e) => setThc(e.target.value)}
              placeholder="22.5"
              className={inputClass}
            />
          </div>
          <div>
            <label className={sectionLabelClass}>CBD %</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={cbd}
              onChange={(e) => setCbd(e.target.value)}
              placeholder="0.8"
              className={inputClass}
            />
          </div>
        </div>

        {/* Tasting notes */}
        <div>
          <label className={sectionLabelClass}>Tasting Notes</label>
          <input
            value={tastingNotes}
            onChange={(e) => setTastingNotes(e.target.value)}
            placeholder="citrus, pine, earth, vanilla"
            className={inputClass}
          />
          <p className="font-accent italic text-[12px] text-cream/45 mt-1.5">
            Comma separated — appears as soft chips on the detail card.
          </p>
        </div>

        {/* Effects */}
        <div>
          <label className={sectionLabelClass}>Effects</label>
          <input
            value={effects}
            onChange={(e) => setEffects(e.target.value)}
            placeholder="relaxing, euphoric, creative"
            className={inputClass}
          />
          <p className="font-accent italic text-[12px] text-cream/45 mt-1.5">
            Comma separated — appears as gold pills on the detail card.
          </p>
        </div>

        {/* Media */}
        <div className="space-y-3 pt-1">
          <MediaDropZone
            accept="image"
            label="Product Image"
            onUrl={(url) => setImageUrl(url)}
            currentUrl={imageUrl || undefined}
          />
          <MediaDropZone
            accept="video"
            label="Product Video (optional)"
            onUrl={(url) => setVideoUrl(url)}
            currentUrl={videoUrl || undefined}
            onClear={() => setVideoUrl('')}
          />
        </div>

        {/* Variants */}
        <div className="space-y-2">
          <label className={sectionLabelClass}>Variants</label>
          <p className="font-accent italic text-[12px] text-cream/45 -mt-1">
            Add each size separately — e.g. 1g · 3.5g · 7g · 1 pre-roll
          </p>

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
              <button
                type="button"
                onClick={() => removeVariant(i)}
                className="shrink-0 text-cream/40 hover:text-red-400 transition-colors"
              >
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
            <button
              type="button"
              onClick={addVariant}
              className="shrink-0 text-gold/70 hover:text-gold transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Save / Cancel */}
        <div className="flex flex-col gap-2 pt-2">
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-4 rounded-2xl text-obsidian text-[12px] uppercase tracking-[0.28em] font-semibold disabled:opacity-40 transition-all duration-300 hover:shadow-[0_12px_32px_-8px_rgba(212,162,76,0.5)]"
            style={{
              background: 'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
              boxShadow:
                'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 6px 20px -8px rgba(212,162,76,0.5)',
            }}
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl text-[11px] uppercase tracking-[0.22em] text-cream/45 hover:text-gold transition-colors duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
