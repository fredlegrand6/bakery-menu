import { createCanvas } from 'canvas';
import { writeFileSync } from 'fs';

// ── Favicon (square, branded) ──
function generateFavicon(size, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  const r = size * 0.2;

  // Rounded rect background
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(size - r, 0);
  ctx.quadraticCurveTo(size, 0, size, r);
  ctx.lineTo(size, size - r);
  ctx.quadraticCurveTo(size, size, size - r, size);
  ctx.lineTo(r, size);
  ctx.quadraticCurveTo(0, size, 0, size - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.fillStyle = '#3d4635';
  ctx.fill();

  // "B" letter
  ctx.fillStyle = '#FEFAE0';
  ctx.font = `bold ${size * 0.55}px serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('B', size / 2, size * 0.46);

  // Terracotta accent line
  ctx.strokeStyle = '#C4661F';
  ctx.lineWidth = Math.max(1, size * 0.04);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(size * 0.3, size * 0.76);
  ctx.lineTo(size * 0.7, size * 0.76);
  ctx.stroke();

  writeFileSync(filename, canvas.toBuffer('image/png'));
  console.log(`Created ${filename} (${size}x${size})`);
}

generateFavicon(32, 'public/favicon-32.png');
generateFavicon(180, 'public/apple-touch-icon.png');
generateFavicon(192, 'public/pwa-192.png');
generateFavicon(512, 'public/pwa-512.png');

// ── OG Image (1200x630) ──
const og = createCanvas(1200, 630);
const ctx = og.getContext('2d');

// Background
ctx.fillStyle = '#3d4635';
ctx.fillRect(0, 0, 1200, 630);

// Terracotta left accent
ctx.fillStyle = '#C4661F';
ctx.fillRect(0, 0, 8, 630);

// Subtle darker border area
ctx.fillStyle = 'rgba(0,0,0,0.15)';
ctx.fillRect(0, 0, 1200, 2);
ctx.fillRect(0, 628, 1200, 2);

// Title
ctx.fillStyle = '#FEFAE0';
ctx.font = 'bold 80px serif';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('THE BAKERY', 600, 240);

// Terracotta divider
ctx.strokeStyle = '#C4661F';
ctx.lineWidth = 2;
ctx.lineCap = 'round';
ctx.beginPath();
ctx.moveTo(560, 290);
ctx.lineTo(640, 290);
ctx.stroke();

// Subtitle
ctx.fillStyle = '#A9B388';
ctx.font = 'italic 30px serif';
ctx.fillText('I B I Z A .', 600, 340);

// Tagline
ctx.fillStyle = '#FEFAE0';
ctx.font = '26px sans-serif';
ctx.fillText('A Private Members Club', 600, 430);

// Bottom terracotta line
ctx.fillStyle = '#C4661F';
ctx.fillRect(80, 530, 1040, 1);

writeFileSync('public/og-image.png', og.toBuffer('image/png'));
console.log('Created public/og-image.png (1200x630)');
