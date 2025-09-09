import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/setupTests.ts'],
    include: ['tests/**/*.test.{ts,tsx,js,jsx}', 'src/**/*.test.{ts,tsx,js,jsx}'],
  },
});
