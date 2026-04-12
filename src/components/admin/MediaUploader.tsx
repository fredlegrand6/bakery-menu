import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Film, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface MediaUploaderProps {
  value: string | null;
  onChange: (url: string | null) => void;
  accept: 'image' | 'video' | 'both';
  label?: string;
}

const ACCEPT_MAP = {
  image: 'image/jpeg,image/png,image/webp,image/gif',
  video: 'video/mp4,video/webm,video/quicktime',
  both: 'image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime',
};

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function isVideo(url: string) {
  return /\.(mp4|webm|mov)(\?|$)/i.test(url);
}

export default function MediaUploader({ value, onChange, accept, label }: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log('[MediaUploader] render — value:', value, 'accept:', accept);

  const upload = useCallback(async (file: File) => {
    setError(null);

    if (file.size > MAX_SIZE) {
      setError('File too large (max 50MB)');
      return;
    }

    const isImg = file.type.startsWith('image/');
    const isVid = file.type.startsWith('video/');
    if (accept === 'image' && !isImg) { setError('Only images allowed'); return; }
    if (accept === 'video' && !isVid) { setError('Only videos allowed'); return; }
    if (accept === 'both' && !isImg && !isVid) { setError('Only images or videos allowed'); return; }

    setUploading(true);
    const ext = file.name.split('.').pop();
    const path = `categories/${crypto.randomUUID()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('bakery-menu-images')
      .upload(path, file);

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('bakery-menu-images')
      .getPublicUrl(path);

    onChange(data.publicUrl);
    setUploading(false);
  }, [accept, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  }, [upload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    onChange(null);
    setError(null);
  };

  if (value) {
    return (
      <div className="space-y-1.5">
        {label && <label className="text-[10px] text-gold/70 uppercase tracking-[0.22em] font-medium">{label}</label>}
        <div className="relative rounded-lg overflow-hidden border border-gold/20 bg-obsidian">
          {isVideo(value) ? (
            <video src={value} className="w-full h-40 object-cover" muted playsInline />
          ) : (
            <img
              src={value}
              alt=""
              className="w-full h-40 object-cover"
              onLoad={() => console.log('[MediaUploader] loaded:', value)}
              onError={(e) => {
                console.warn('[MediaUploader] failed to load:', value);
                const el = e.currentTarget;
                el.style.display = 'none';
                const fallback = el.nextElementSibling as HTMLElement | null;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
          )}
          {/* fallback when img fails — hidden by default, shown via onError */}
          <div
            className="hidden w-full h-40 items-center justify-center bg-obsidian text-gold/45 text-[10px] uppercase tracking-[0.22em]"
          >
            image unavailable
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-cream hover:bg-black/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs text-sage/60 font-medium">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
          dragOver
            ? 'border-gold/60 bg-gold/[0.08]'
            : 'border-gold/20 hover:border-gold/40 bg-white/[0.015]'
        )}
      >
        {uploading ? (
          <Loader2 size={24} className="text-gold animate-spin" />
        ) : (
          <>
            <div className="flex items-center gap-2 text-gold/60">
              {accept === 'video' ? <Film size={20} /> : accept === 'image' ? <Image size={20} /> : (
                <><Image size={18} /><Film size={18} /></>
              )}
              <Upload size={20} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-cream/45 text-center">
              Drop {accept === 'both' ? 'image or video' : accept} here or click to browse
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT_MAP[accept]}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
