import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    // base: './',
    // It is important to set the base path to the subdirectory where the app will be hosted. In this case, it is '/inicode-initial-code-language/'.
    // change this to the appropriate subdirectory if you are hosting the app in a different location.
    base: '/inicode-initial-code-language/',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['pwa-192x192.svg', 'pwa-512x512.svg'],
        manifest: {
          name: 'IniCode - IDE Algorithmique',
          short_name: 'IniCode',
          description: 'IDE Algorithmique en Français & Transpileur interactif',
          theme_color: '#ea580c',
          background_color: '#141418',
          display: 'standalone',
          icons: [
            {
              src: '/pwa-192x192.svg',
              sizes: '192x192',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
            {
              src: '/pwa-512x512.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          // Définir la limite à 8 Mo (8 * 1024 * 1024)
          maximumFileSizeToCacheInBytes: 8388608,
        }
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        'monaco-editor/esm': path.resolve(__dirname, 'node_modules/monaco-editor/esm'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
