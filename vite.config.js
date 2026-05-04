import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        react()
    ],
    css: {
        postcss: null, // Disable PostCSS as Tailwind v4 handles it
    },
    base: './',
    //root: resolve(__dirname, 'src/ui'),
    //publicDir: resolve(__dirname, 'src/assets'),
    server: {
        port: 30001,
    },
    build: {
        outDir: resolve(__dirname, 'build'),
        emptyOutDir: true,
        rollupOptions: {
            input: resolve(__dirname, 'index.html'),
            output: {
                // Ensure relative paths in build
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            },
            manualChunks: {
                // ← Split heavy deps into separate chunks
                'vendor-react': ['react', 'react-dom'],
            }
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src/ui/'),
            '@assets': resolve(__dirname, 'src/assets'),
            '@common': resolve(__dirname, 'src/common'),
            '@main': resolve(__dirname, 'src/main'),
            '@styles': resolve(__dirname, 'src/styles/'),
            '@types': resolve(__dirname, 'src/types'),
            crypto: require.resolve('crypto-browserify'),
            process: require.resolve('process/browser'),
            fs: require.resolve('browserify-fs'),
            buffer: require.resolve('buffer/'),
        },
    },
    define: {
        'process.env': {}
    },
    optimizeDeps: {
        include: [
            'buffer',
            'crypto-browserify',
            'process/browser',
            'browserify-fs',
        ],
    },
    compilerOptions: {
        // jsx: "react-jsx", // For React 17+ JSX transform
        jsx: "react-jsxdev" // For development with better debugging
    },
});
