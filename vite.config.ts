import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Resulberdy',
        short_name: 'Resulberdy',
        description: 'Ресторан Resulberdy — меню и заказы',
        theme_color: '#1a0a00',
        background_color: '#1a0a00',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/resulberdybackend-production\.up\.railway\.app\/menu/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'menu-cache', expiration: { maxAgeSeconds: 300 } }
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com\//,
            handler: 'CacheFirst',
            options: { cacheName: 'images-cache', expiration: { maxEntries: 100, maxAgeSeconds: 86400 } }
          }
        ]
      }
    })
  ]
})
