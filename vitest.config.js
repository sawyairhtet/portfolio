import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        pool: 'vmForks',
        environment: 'jsdom',
        setupFiles: ['src/tests/setup.ts'],
        include: ['src/tests/**/*.test.{ts,tsx}'],
        globals: true,
    },
});
