import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from the Playwright folder only (no env-specific overlays)
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const CP_BASE_URL = process.env.CP_BASE_URL;
const BO_BASE_URL = process.env.BO_BASE_URL;

export default defineConfig({
  testDir: './ClientPortal/tests', // Default to ClientPortal tests
  globalSetup: './global-setup.ts',
  timeout: 45_000,
  retries: 1,
  outputDir: './artifacts',

  use: {
    headless: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
    contextOptions: { ignoreHTTPSErrors: true },
  },

  projects: [
    // Client Portal Tests
    {
      name: 'ClientPortal',
      testDir: './ClientPortal/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: CP_BASE_URL, // Default to Client Portal
        storageState: path.resolve(__dirname, 'ClientPortal', 'fixtures', 'session', 'session.json'),
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
    },

    // Back Office Tests
    {
      name: 'BackOffice',
      testDir: './BackOffice/tests',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BO_BASE_URL,
        storageState: path.resolve(__dirname, 'BackOffice', 'fixtures', 'session', 'session.json'),
        launchOptions: {
          args: ['--disable-web-security', '--disable-features=VizDisplayCompositor'],
        },
      },
    },
  ],

  reporter: [
    ['html', { outputFolder: './reports/html', open: 'never' }],
    ['junit', { outputFile: './reports/junit/results.xml' }],
    ['list'],
  ],

  expect: { timeout: 30_000 },
  fullyParallel: false,
  workers: 1,
});
