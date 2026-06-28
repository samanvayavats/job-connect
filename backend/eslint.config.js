import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,

    {
        files: ['**/*.js'],

        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',

            globals: {
                ...globals.node
            }
        },

        rules: {
            // Best practices
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'no-undef': 'error',
            'no-var': 'error',
            'prefer-const': 'warn',

            // Style
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            indent: ['error', 4],
            'comma-dangle': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'array-bracket-spacing': ['error', 'never'],

            // Cleaner code
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'arrow-spacing': 'error',
            'keyword-spacing': 'error',
            'space-before-blocks': 'error',
            'space-infix-ops': 'error',
            'eol-last': 'error'
        }
    }
];
