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
        <h2 className="font-display text-xl font-bold text-cream">QR Codes</h2>
        <button
          onClick={addItem}
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-terracotta text-cream font-medium hover:bg-terracotta/85 transition-colors duration-300"
        >
          <Plus size={14} /> Add QR Code
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {qrList.map((item) => (
          <div key={item.id} className="rounded-2xl bg-black/20 border border-sage/[0.08] p-5 space-y-4">
            <div className="flex items-center gap-3">
              <input
                value={item.label}
                onChange={(e) => updateItem(item.id, 'label', e.target.value)}
                placeholder="e.g. Table 1, Terrace, VIP"
                className="flex-1 font-display text-lg text-cream bg-white/[0.05] border border-sage/20 rounded-xl px-3 py-2.5 focus:border-terracotta focus:outline-none transition-colors"
              />
              {qrList.length > 1 && (
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-sage/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              <p className="text-xs text-sage/30 italic px-1">Each QR code needs a unique URL to be different. Edit the table name above.</p>
              <input
                value={item.url}
                onChange={(e) => updateItem(item.id, 'url', e.target.value)}
                placeholder="https://menu.thebakeryibiza.com?table=1"
                className="w-full text-sm text-sage/60 bg-white/[0.05] border border-sage/15 rounded-xl px-3 py-2 focus:border-terracotta focus:outline-none transition-colors"
              />
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-sage/40 hover:text-sage transition-colors mt-1 px-1"
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-terracotta text-cream font-medium text-xs hover:bg-terracotta/90 transition-colors"
              >
                <Download size={14} />
                Download PNG
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-sage/20 text-sage hover:text-cream hover:border-sage/40 font-medium text-xs transition-colors"
              >
                <Printer size={14} />
                Print
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
