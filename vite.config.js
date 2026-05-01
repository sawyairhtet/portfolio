import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), tailwindcss()],
    root: '.',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html',
                offline: './offline.html',
                404: './404.html',
            },
            output: {
                manualChunks(id) {
                    // React core — long-lived cache
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/scheduler/')) {
                        return 'vendor-react';
                    }
                    // Routing + data fetching
                    if (id.includes('node_modules/react-router') || id.includes('node_modules/@tanstack/') || id.includes('node_modules/axios/')) {
                        return 'vendor-query';
                    }
                    // Forms + validation (only loaded with ContactApp)
                    if (id.includes('node_modules/zod/') || id.includes('node_modules/react-hook-form/') || id.includes('node_modules/@hookform/')) {
                        return 'vendor-forms';
                    }
                },
            },
        },
    },
    server: { port: 3000, open: true },
});
