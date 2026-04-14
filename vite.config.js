import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html',
                offline: './offline.html',
                404: './404.html',
            },
        },
    },
    server: { port: 3000, open: true },
});
