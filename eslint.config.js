// ESLint Configuration - Modern Flat Config
// @ts-check

import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
        },
        rules: {
            // Code Quality
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': ['warn', { allow: ['error', 'warn'] }],
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-arrow-callback': 'error',

            // Best Practices
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-return-await': 'error',

            // Style (Prettier handles formatting, these catch issues)
            'no-trailing-spaces': 'error',
            'eol-last': 'error',
        },
    },
    {
        // Ignore patterns
        ignores: ['node_modules/**', 'dist/**', '**/*.min.js'],
    },
];
