import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/accessibility',
  timeout: 60_000,
  retries: process.env.CI ? 2 : 0,
  use: {
    headless: true,
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    viewport: { width: 1280, height: 800 },
    actionTimeout: 10_000,
    navigationTimeout: 30_000
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ]
});
