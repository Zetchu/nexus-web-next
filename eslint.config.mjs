import storybook from 'eslint-plugin-storybook';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = [
  // 1. GLOBAL IGNORES
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      'node_modules/**',
      'next-env.d.ts',
      'playwright-report/**',
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
    },
  },
];

export default eslintConfig;
