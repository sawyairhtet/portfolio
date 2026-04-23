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
        setupFiles: ['src/tests/setup.ts', 'test/setup.js'],
        include: ['src/tests/**/*.test.{ts,tsx}', 'test/**/*.test.js'],
        globals: true,
        coverage: {
            provider: 'v8',
            include: ['src/**', 'js/**'],
            thresholds: { statements: 80 },
        },
    },
});
