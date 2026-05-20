import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const reactRefreshPreambleHash = "'sha256-Z2/iFzh9VMlVkEOar1f/oSHWwQk3ve1qk/C2WdsC4Xk='";

/**
 * Dev-only CSP meta tag — mirrors the production Netlify headers so CSP
 * violations surface during development, not only after deploy.
 */
const devCspPlugin = () => ({
    name: 'inject-dev-csp',
    transformIndexHtml(html, ctx) {
        if (!ctx.server) return html; // production builds use Netlify headers
        const csp = [
            "default-src 'self'",
            `script-src 'self' ${reactRefreshPreambleHash} https://plausible.io`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self' https://formspree.io https://plausible.io ws://localhost:* http://localhost:* ws://127.0.0.1:* http://127.0.0.1:*",
            "worker-src 'self'",
            "manifest-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self' https://formspree.io",
        ].join('; ');
        return html.replace(
            '<head>',
            `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`
        );
    },
});

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        devCspPlugin(),
        {
            name: 'inject-sw-cache-version',
            closeBundle() {
                const swPath = path.resolve(__dirname, 'dist/sw.js');
                try {
                    const content = readFileSync(swPath, 'utf-8');
                    const hash = Date.now().toString(36);
                    writeFileSync(swPath, content.replace('__BUILD_HASH__', hash));
                } catch { /* dev mode — sw.js not in dist */ }
            },
        },
    ],
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
                    if (id.includes('node_modules/react-router') || id.includes('node_modules/@tanstack/')) {
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
