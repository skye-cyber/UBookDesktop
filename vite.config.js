import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    css: {
        // Tailwind v4 handles its own PostCSS pipeline.
        // Set to null only if you truly have no PostCSS plugins.
        postcss: null,
    },

    // Relative base so assets resolve correctly inside the Tauri webview.
    base: './',

    // Tauri expects a fixed port and fails if it's unavailable.
    clearScreen: false,
    server: {
        port: 4043,
        strictPort: true,
        host: host || false,
        hmr: host
            ? {
                protocol: 'ws',
                host,
                port: 1421,
            }
            : undefined,
        watch: {
            // Don't let Vite watch Rust/Tauri build artifacts.
            ignored: ['**/src-tauri/**'],
        },
    },

    // Expose VITE_* and TAURI_ENV_* to the client.
    envPrefix: ['VITE_', 'TAURI_ENV_*'],

    build: {
        // Chromium (Windows) vs WebKit (macOS/Linux) targets.
        target:
            process.env.TAURI_ENV_PLATFORM === 'windows' ? 'chrome105' : 'safari13',
        minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
        sourcemap: !!process.env.TAURI_ENV_DEBUG,

        // Match tauri.conf.json -> build.frontendDist
        outDir: resolve(import.meta.dirname, 'dist'), //resolve(__dirname, 'dist'),
        emptyOutDir: true,

        rollupOptions: {
            input: resolve(import.meta.dirname, 'index.html'),//resolve(__dirname, 'index.html'),
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
            manualChunks: {
                'vendor-react': ['react', 'react-dom'],
                'vendor-tauri': [
                    '@tauri-apps/api',
                    '@tauri-apps/plugin-opener',
                    '@tauri-apps/plugin-dialog',
                    '@tauri-apps/plugin-fs',
                    '@tauri-apps/plugin-store',
                    '@tauri-apps/plugin-shell',
                ],
            },
        },
    },

    resolve: {
        alias: {
            '@': resolve(import.meta.dirname,'src/ui'), //resolve(__dirname, 'src/ui'),
            '@assets': resolve(import.meta.dirname,'src/assets'), //resolve(__dirname, 'src/assets'),
            '@common': resolve(import.meta.dirname,'src/common'), //resolve(__dirname, 'src/common'),
            '@styles': resolve(import.meta.dirname,'src/style'), //resolve(__dirname, 'src/styles'),
            '@types': resolve(import.meta.dirname,'src/types'), //resolve(__dirname, 'src/types'),
            // NOTE: Node polyfills removed — no longer needed with Tauri.
        },
    }

    // No `define: { 'process.env': {} }` — Vite handles env vars natively
    // via import.meta.env. The old shim was only for Node-based Electron code.
});
