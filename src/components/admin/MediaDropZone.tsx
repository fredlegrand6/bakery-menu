import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Film, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface MediaDropZoneProps {
  onUrl: (url: string) => void;
  currentUrl?: string | null;
  accept?: 'image' | 'video' | 'both';
  label?: string;
  onClear?: () => void;
}

const ACCEPT_MAP = {
  image: 'image/jpeg,image/png,image/webp',
  video: 'video/mp4,video/quicktime',
  both: 'image/jpeg,image/png,image/webp,video/mp4,video/quicktime',
};

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

function isVideo(url: string) {
  return /\.(mp4|mov|webm)(\?|$)/i.test(url);
}

export default function MediaDropZone({ onUrl, currentUrl, accept = 'image', label, onClear }: MediaDropZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
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
    setProgress(0);

    // Simulate progress since Supabase SDK doesn't expose upload progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 200);

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from('bakery-menu-images')
      .upload(fileName, file, { upsert: true });

    clearInterval(progressInterval);

    if (uploadErr) {
      setError(uploadErr.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    const { data } = supabase.storage
      .from('bakery-menu-images')
      .getPublicUrl(fileName);

    onUrl(data.publicUrl);
    setUploading(false);
    setProgress(0);
  }, [accept, onUrl]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  }, [uploadFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleRemove = () => {
    onUrl('');
    onClear?.();
    setError(null);
  };

  // Preview state
  if (currentUrl) {
    return (
      <div className="space-y-1.5">
        {label && <label className="text-xs text-sage/60 font-medium">{label}</label>}
        <div className="relative rounded-lg overflow-hidden border border-sage/15 bg-olive-dark">
          {isVideo(currentUrl) ? (
            <video src={currentUrl} className="w-full h-40 object-cover" muted playsInline />
          ) : (
            <img src={currentUrl} alt="Preview" className="w-full h-40 object-cover" />
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-cream hover:bg-black/80 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  // Upload zone
  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs text-sage/60 font-medium">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(false); }}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors',
          dragOver
            ? 'border-sage bg-sage/10'
            : 'border-sage/20 hover:border-sage/40 bg-olive-dark/50',
          uploading && 'pointer-events-none'
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-sage animate-spin" />
            <div className="w-32 h-1.5 rounded-full bg-sage/10 overflow-hidden">
              <div
                className="h-full bg-sage rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-sage/40">Uploading...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sage/50">
              {accept === 'video' ? <Film size={20} /> : accept === 'image' ? <Image size={20} /> : (
                <><Image size={18} /><Film size={18} /></>
              )}
              <Upload size={20} />
            </div>
            <p className="text-xs text-cream/40 text-center">
              {dragOver
                ? 'Drop file here'
                : `Drop ${accept === 'both' ? 'image or video' : accept} here or click to browse`
              }
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
