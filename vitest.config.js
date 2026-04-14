import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        pool: 'vmForks',
        environment: 'jsdom',
        setupFiles: ['test/setup.js'],
        include: ['test/**/*.test.js'],
        coverage: {
            provider: 'v8',
            include: ['js/core/**'],
            thresholds: { statements: 80 },
        },
    },
});
