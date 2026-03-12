import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    // ─── Server ─────────────────────────────────────────────────────────
    server: {
        port: 3009,
        strictPort: true,
        open: false, // Electron opens its own window; set `true` for web-only
    },

    // ─── Path Aliases ────────────────────────────────────────────────────
    // Mirrors the ~/* aliases from the original Terakota tsconfig so
    // existing imports like `~/components/Foo` keep working unchanged.
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'src'),
            '~/components': path.resolve(__dirname, 'src/components'),
            '~/pages': path.resolve(__dirname, 'src/pages'),
            '~/layouts': path.resolve(__dirname, 'src/layouts'),
            '~/features': path.resolve(__dirname, 'src/features'),
            '~/routes': path.resolve(__dirname, 'src/routes'),
            '~/store': path.resolve(__dirname, 'src/store'),
            '~/contexts': path.resolve(__dirname, 'src/contexts'),
            '~/utils': path.resolve(__dirname, 'src/utils'),
            '~/styles': path.resolve(__dirname, 'src/styles'),
            '~/i18n': path.resolve(__dirname, 'src/i18n'),
            '~/types': path.resolve(__dirname, 'src/types'),
            '~/assets': path.resolve(__dirname, 'src/assets'),
            '~/hooks': path.resolve(__dirname, 'src/hooks'),
            '~/services': path.resolve(__dirname, 'src/services'),
        },
    },

    // ─── Build ───────────────────────────────────────────────────────────
    build: {
        outDir: 'dist',
        sourcemap: false, // Enable for debugging; disable for production builds
        rollupOptions: {
            output: {
                // Manual chunk splitting: separates MUI/Vendor from app code.
                // Keeps initial bundle small.
                manualChunks: {
                    'vendor-react': ['react', 'react-dom', 'react-router-dom'],
                    'vendor-mui': ['@mui/material', '@mui/icons-material', '@mui/system'],
                    'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
                    'vendor-motion': ['framer-motion'],
                },
            },
        },
    },

    // ─── Plugins ─────────────────────────────────────────────────────────
    plugins: [
        react({
            // Using Emotion as JSX runtime (same as Terakota).
            // jsxImportSource is sufficient for full MUI + Emotion support.
            // @emotion/babel-plugin is NOT required here — it is an optional
            // enhancement (auto-labelling, css-prop shorthand) that must be
            // explicitly installed. Listing it without installing it causes
            // Vite's babel resolver to throw on startup.
            jsxImportSource: '@emotion/react',
        }),

        // PWA Configuration
        // Generates service worker, manifest, and offline capability.
        // When running as Electron the SW is simply inactive.
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
            manifest: {
                name: 'Terakota Foundation',
                short_name: 'Terakota',
                description: 'Terakota Foundation App',
                theme_color: '#1976d2',
                background_color: '#ffffff',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: 'pwa-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'pwa-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable',
                    },
                ],
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        // Cache Google Fonts
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
                        },
                    },
                ],
            },
            devOptions: {
                enabled: false, // Set `true` to debug SW in dev mode
            },
        }),
    ],

    // ─── Optimise Deps ───────────────────────────────────────────────────
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            '@mui/material',
            '@mui/icons-material',
            '@reduxjs/toolkit',
            'react-redux',
            'framer-motion',
            'i18next',
            'react-i18next',
        ],
    },
});
