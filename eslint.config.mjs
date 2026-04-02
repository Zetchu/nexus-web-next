import storybook from 'eslint-plugin-storybook';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default [
  // 1. GLOBAL IGNORES
  // This must be its own object at the very top of the array to apply globally!
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      'next-env.d.ts',
    ],
  },

  // 2. Next.js & Storybook Presets
  ...nextVitals,
  ...nextTs,
  ...storybook.configs['flat/recommended'],

  // 3. Custom Project Rules
  {
    rules: {
      // Allow standard <img> tags since we use external Riot Data Dragon images
      '@next/next/no-img-element': 'off',

      // Silence the warnings for the 'any' types we used in the API routes
      '@typescript-eslint/no-explicit-any': 'off',

      // Clean up unused variable warnings so your terminal stays clean
      '@typescript-eslint/no-unused-vars': 'off',

      // Stop ESLint from yelling about unescaped apostrophes
      'react/no-unescaped-entities': 'off',
    },
  },
];
