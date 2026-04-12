import { useState, useCallback, useEffect } from 'react';
import pkg from 'react-qr-code';
const QRCode = (pkg as unknown as { default: typeof pkg }).default ?? pkg;
import { toCanvas } from 'qrcode';
import { Download, Printer, Plus, Trash2, ExternalLink } from 'lucide-react';

interface QrItem {
  id: number;
  label: string;
  url: string;
}

export default function AdminQRTab() {
  const [qrList, setQrList] = useState<QrItem[]>(() => {
    try {
      const saved = localStorage.getItem('bakery_qr_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [{ id: 1, label: 'Main Entrance', url: 'https://menu.thebakeryibiza.com' }];
  });

  useEffect(() => {
    localStorage.setItem('bakery_qr_list', JSON.stringify(qrList));
  }, [qrList]);

  const updateItem = (id: number, field: 'label' | 'url', value: string) => {
    setQrList((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const addItem = () => {
    const slug = `table-${Date.now()}`;
    setQrList((prev) => [...prev, { id: Date.now(), label: 'New QR Code', url: `https://menu.thebakeryibiza.com?table=${slug}` }]);
  };

  const removeItem = (id: number) => {
    setQrList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleDownload = useCallback(async (item: QrItem) => {
    const canvas = document.createElement('canvas');
    const size = 1024;
    const padding = 80;
    canvas.width = size + padding * 2;
    canvas.height = size + padding * 2 + 120;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#3d4635';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const qrCanvas = document.createElement('canvas');
    await toCanvas(qrCanvas, item.url, {
      width: size,
      margin: 0,
      color: { dark: '#FEFAE0', light: '#3d4635' },
    });

    ctx.drawImage(qrCanvas, padding, padding);

    ctx.fillStyle = '#FEFAE0';
    ctx.font = '600 28px "DM Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('THE BAKERY IBIZA', canvas.width / 2, size + padding + 60);

    ctx.fillStyle = '#A9B388';
    ctx.font = '16px "DM Sans", sans-serif';
    ctx.fillText(item.label, canvas.width / 2, size + padding + 95);

    const slug = item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const link = document.createElement('a');
    link.download = `bakery-qr-${slug}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2
          className="font-display text-2xl text-cream"
          style={{ fontVariationSettings: '"SOFT" 30, "opsz" 144, "wght" 500' }}
        >
          QR Codes
        </h2>
        <button
          onClick={addItem}
          className="flex items-center gap-2 px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.22em] font-semibold text-obsidian transition-all duration-300 hover:shadow-[0_10px_30px_-6px_rgba(212,162,76,0.6)]"
          style={{
            background: 'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 6px 20px -8px rgba(212,162,76,0.5)',
          }}
        >
          <Plus size={14} strokeWidth={2.5} /> Add QR Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {qrList.map((item) => (
          <div className="rounded-2xl glass p-5 space-y-4" key={item.id}>
            <div className="flex items-center gap-3">
              <input
                value={item.label}
                onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                placeholder="e.g. Table 1, Terrace, VIP"
                className="flex-1 font-display text-lg text-cream bg-white/[0.03] border border-gold/20 rounded-xl px-3 py-2.5 focus:border-gold/55 focus:bg-gold/[0.04] focus:outline-none transition-all duration-300"
                style={{ fontVariationSettings: '"SOFT" 20, "opsz" 144, "wght" 500' }}
              />
              {qrList.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-cream/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="font-accent italic text-[11px] text-cream/40 px-1">Each QR code needs a unique URL to be different. Edit the table name above.</p>
              <input
                value={item.url}
                onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                placeholder="https://menu.thebakeryibiza.com?table=1"
                className="w-full text-[12px] text-cream/65 bg-white/[0.03] border border-gold/15 rounded-xl px-3 py-2 focus:border-gold/55 focus:outline-none transition-all duration-300"
              />
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-gold/55 hover:text-gold transition-colors mt-1 px-1"
                >
                  <ExternalLink size={10} /> Preview URL
                </a>
              )}
            </div>

            <div className="flex justify-center">
              <div className="bg-olive-deep rounded-xl p-3">
                <QRCode
                  value={item.url}
                  size={180}
                  fgColor="#FEFAE0"
                  bgColor="#3d4635"
                  level="M"
                />
              </div>
            </div>

            <div className="flex justify-center gap-2">
              <button
                onClick={() => handleDownload(item)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-obsidian text-[10px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:shadow-[0_10px_24px_-8px_rgba(212,162,76,0.5)]"
                style={{
                  background: 'linear-gradient(180deg, #E8C17A 0%, #D4A24C 50%, #8C6A2A 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255,250,224,0.4), inset 0 -1px 0 rgba(0,0,0,0.2), 0 4px 14px -6px rgba(212,162,76,0.4)',
                }}
              >
                <Download size={13} strokeWidth={2.5} />
                Download PNG
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-gold/25 text-gold/75 hover:text-gold hover:border-gold/55 hover:bg-gold/[0.04] text-[10px] uppercase tracking-[0.2em] font-medium transition-all duration-300"
              >
                <Printer size={13} />
                Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
