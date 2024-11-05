/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    watch: process.env.NODE_ENV === 'development',
    include: ['**/*.test.ts'],
    exclude: ['**/node_modules/**'],
    coverage: {
      reporter: [
        ['json-summary'],
        ['json'],
        ['lcov', { projectRoot: './src' }],
        ['text'],
      ],
    },
  },
});
