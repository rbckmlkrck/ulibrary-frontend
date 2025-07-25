/**
 * frontend/eslint.config.js
 *
 * This file is part of the University Library project.
 * It configures ESLint for the frontend codebase, setting up rules for
 * JavaScript, TypeScript, and React, and integrating with Vite.
 *
 * Author: Raul Berrios
 */
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config([
  {
    // Ignore the build output directory.
    ignores: ['dist/'],
  },
  {
    // Apply these rules to all TypeScript and TSX files.
    files: ['**/*.{ts,tsx}'],
    // Extend from recommended rule sets.
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // reactHooks.configs['recommended-latest'], // This seems to be an incorrect reference
      // reactRefresh.configs.vite, // This also seems incorrect
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'warn',
    },
  },
])
