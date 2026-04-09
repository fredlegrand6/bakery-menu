import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              networkTimeoutSeconds: 3,
              cacheName: 'pages',
              expiration: { maxEntries: 10, maxAgeSeconds: 3600 },
            },
          },
          {
            urlPattern: /\.(?:jpg|jpeg|png|webp|svg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: { maxEntries: 60, maxAgeSeconds: 2592000 },
            },
          },
        ],
      },
      manifest: {
        name: 'The Bakery Ibiza',
        short_name: 'The Bakery',
        description: 'Digital menu for The Bakery Ibiza',
        start_url: '/',
        display: 'standalone',
        background_color: '#3d4635',
        theme_color: '#3d4635',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify((process.env.VITE_SUPABASE_URL ?? 'https://dgositkpfinibvffuvtm.supabase.co').trim()),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify((process.env.VITE_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnb3NpdGtwZmluaWJ2ZmZ1dnRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDcyODAsImV4cCI6MjA4OTQyMzI4MH0.rwfI-BWRteh3-Q8l6C7z6YSjiKE-0Ihbsb2c4H4W_BU').trim()),
    'import.meta.env.VITE_ADMIN_PASSWORD': JSON.stringify((process.env.VITE_ADMIN_PASSWORD ?? 'bakery420').trim()),
  },
});
