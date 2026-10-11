import { defineConfig, devices } from '@playwright/test';

const baseURL = `http://127.0.0.1:4173${process.env.GITHUB_PAGES === 'true' ? '/react-ui/' : '/'}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  workers: 4,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: 'npm run preview -w @mucsi96/react-ui-gallery',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
