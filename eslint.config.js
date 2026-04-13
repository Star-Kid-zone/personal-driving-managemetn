import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

export default [
    js.configs.recommended,
    {
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        languageOptions: {
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
            },
            globals: {
                window: 'readonly',
                document: 'readonly',
                route: 'readonly',
            },
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'no-console': ['warn', { allow: ['error'] }],
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        },
        settings: {
            react: { version: 'detect' },
        },
    },
    {
        ignores: ['public/build/**', 'node_modules/**', 'vendor/**'],
    },
];
