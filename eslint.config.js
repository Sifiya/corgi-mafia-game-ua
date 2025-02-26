import js from '@eslint/js';
import solid from 'eslint-plugin-solid/configs/typescript';
import * as tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin-js';
import typescript from '@typescript-eslint/eslint-plugin';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['node_modules', '.next/', 'dist', 'public', '.history/'],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ...solid,
    plugins: {
      '@typescript-eslint': typescript,
      '@stylistic/js': stylisticJs,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'always'],
      '@stylistic/js/no-trailing-spaces': 'error',
      '@stylistic/js/no-multi-spaces': 'error',
      '@stylistic/js/no-multiple-empty-lines': ['error', { max: 1 }],
      '@stylistic/js/no-whitespace-before-property': 'error',
      '@stylistic/js/space-before-function-paren': ['error', 'always'],
      '@stylistic/js/space-before-blocks': ['error', 'always'],
      '@stylistic/js/space-in-parens': ['error', 'never'],
      '@stylistic/js/space-infix-ops': 'error',
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
];
