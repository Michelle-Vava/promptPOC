import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'

export default [
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Inline styles are intentional — design tokens are runtime values
      'react/forbid-component-props': 'off',
      'react/no-inline-styles': 'off',
    },
  },
]
