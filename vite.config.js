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
        },
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src/ui/'),
            '@assets': resolve(__dirname, 'src/assets'),
            '@common': resolve(__dirname, 'src/common'),
            '@renderer': resolve(__dirname, 'src/renderer'),
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
        include: ['buffer'],
        //force: true
    },
    compilerOptions: {
        // jsx: "react-jsx", // For React 17+ JSX transform
        jsx: "react-jsxdev" // For development with better debugging
    },
    // Ensure proper React configuration
    esbuild: {
        //jsxInject: `import React from 'react'`
    }
});
