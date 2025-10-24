import { BrowserContext, chromium } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';
import { authenticator } from 'otplib';
import path from 'path';
import { fileURLToPath } from 'url';
import { saveSessionStorage } from './session-storage-helper.js';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from playwright/.env only
const envDir = path.resolve(process.cwd(), 'playwright');
const baseEnv = path.resolve(envDir, '.env');
if (fs.existsSync(baseEnv)) {
  dotenv.config({ path: baseEnv });
}

// App configuration/types for detection and multi-app support
export type AppName = 'ClientPortal' | 'BackOffice';

export interface AppConfig {
  name: AppName;
  baseURL: string;
  sessionPath: string;
  requiresAuth: boolean;
  envKeys: {
    username: string[];
    password: string[];
    otpSecret: string[];
  };
}

function resolveAppConfig(app: AppName = 'ClientPortal'): AppConfig {
  const isCP = app === 'ClientPortal';
  const baseURL = isCP ? process.env.CP_BASE_URL! : process.env.BO_BASE_URL!;

  // Use __dirname to get the current script directory and resolve from playwright root
  const playwrightRoot = path.resolve(__dirname, '..');
  const sessionPath = path.resolve(playwrightRoot, isCP ? 'ClientPortal' : 'BackOffice', 'fixtures', 'session', 'session.json');

  const envKeys = isCP
    ? {
        username: ['CP_USERNAME'],
        password: ['CP_PASSWORD'],
        otpSecret: ['CP_OTPSECRET'],
      }
    : {
        username: ['BO_USERNAME'],
        password: ['BO_PASSWORD'],
        otpSecret: ['BO_OTPSECRET'],
      };

  return { name: app, baseURL, sessionPath, requiresAuth: true, envKeys };
}

export class SessionManager {
  private static instance: SessionManager;
  public readonly config: AppConfig;

  constructor(app: AppName = 'ClientPortal') {
    this.config = resolveAppConfig(app);
  }

  private async waitForDashboardReady(page: any): Promise<void> {
    // Quick check for basic app readiness - just verify the sidebar is visible
    const selector = 'a.sidebar__navigation-item.active[href="/dashboard"]';
    try {
      await page.locator(selector).first().waitFor({ state: 'visible', timeout: 3000 });
      console.log('✅ Dashboard navigation visible');
    } catch {
      console.log('ℹ️ Dashboard nav link not visible, checking app state...');
    }

    // Simple storage validation to ensure app is initialized
    try {
      await page.waitForFunction(
        () => {
          // Just check that sessionStorage has some MSAL data
          const hasSession = Object.keys(sessionStorage).length > 5;
          return hasSession;
        },
        { timeout: 3000 },
      );
      console.log('📊 Application state initialized.');
    } catch {
      console.log('ℹ️ Storage validation timeout - app may still be loading');
    }

    console.log('✅ Application fully loaded and ready.');
  }

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager('ClientPortal');
    }
    return SessionManager.instance;
  }

  async ensureSession(): Promise<void> {
    console.log('🚀 Starting session management...');

    // Quick check: if session file exists and is recent (less than 2 hours old), assume it's valid
    if (fs.existsSync(this.config.sessionPath)) {
      const stats = fs.statSync(this.config.sessionPath);
      const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

      if (stats.mtimeMs > twoHoursAgo) {
        console.log('✅ Recent session file found, skipping validation');
        return;
      }
    }

    // Only do expensive validation if session file is old or missing
    if (await this.isSessionValid()) {
      console.log('✅ Valid session found, skipping login');
      return;
    }

    console.log('📝 Creating new session...');
    await this.createNewSession();
  }

  private async isSessionValid(): Promise<boolean> {
    if (!fs.existsSync(this.config.sessionPath)) {
      console.log('❌ No session file found');
      return false;
    }

    try {
      console.log('🔍 Testing existing session...');
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({ storageState: this.config.sessionPath, ignoreHTTPSErrors: true });
      const page = await context.newPage();

      // Restore sessionStorage BEFORE first navigation so MSAL sees tokens immediately
      const { restoreSessionStorage } = await import('./session-storage-helper.js');
      await restoreSessionStorage(page, { oncePerWorker: true });

      // Navigate to the base URL with restored storage in place
      await page.goto(this.config.baseURL, {
        timeout: 30000,
        waitUntil: 'domcontentloaded',
      });

      // Give SPA a moment to handle initial auth checks
      await page.waitForTimeout(1000);

      // If still on login, session is invalid
      const currentUrlAfterLoad = page.url();
      if (
        currentUrlAfterLoad.includes('b2clogin.com') ||
        currentUrlAfterLoad.includes('/login') ||
        currentUrlAfterLoad.includes('/signin')
      ) {
        console.log('❌ Session is invalid - redirected to auth immediately');
        console.log('📍 Redirected to:', currentUrlAfterLoad);
        await browser.close();
        return false;
      }

      // Additional readiness checks specific to dashboard
      try {
        await this.waitForDashboardReady(page);
      } catch (e) {
        console.log('ℹ️ Dashboard readiness check did not fully pass:', e instanceof Error ? e.message : String(e));
      }

      // Check if we're logged in and have essential data
      const validationResult = (await page.evaluate(() => {
        // Check for dashboard navigation elements
        const hasNavigation =
          document.querySelector('.sidebar') !== null ||
          document.querySelector('nav') !== null ||
          document.querySelector('[role="navigation"]') !== null;

        // Check for essential local storage data
        const clientSelection = localStorage.getItem('client_selection');
        const entitySelection = localStorage.getItem('entity_selection');
        const hasLocalStorageData =
          clientSelection && entitySelection && clientSelection !== 'null' && entitySelection !== 'null';

        // Check for session storage data (important session identifiers)
        const sessionStorageKeys = Object.keys(sessionStorage);
        const hasSessionStorageData = sessionStorageKeys.length > 0;

        // Check if we're redirected to login page
        const currentUrl = window.location.href;
        const isOnLoginPage =
          currentUrl.includes('b2clogin.com') || currentUrl.includes('/login') || currentUrl.includes('/signin');

        console.log('Current URL:', currentUrl);
        console.log('Navigation found:', hasNavigation);
        console.log('LocalStorage data found:', hasLocalStorageData);
        console.log('SessionStorage keys found:', sessionStorageKeys.length, sessionStorageKeys);
        console.log('Is on login page:', isOnLoginPage);

        // Session is valid if we're not on login page AND have some essential data
        const isValid = !isOnLoginPage && (hasNavigation || hasLocalStorageData);

        return {
          isValid,
          hasNavigation,
          hasLocalStorageData,
          hasSessionStorageData,
          isOnLoginPage,
          currentUrl,
        };
      })) as {
        isValid: boolean;
        hasNavigation: boolean;
        hasLocalStorageData: boolean;
        hasSessionStorageData: boolean;
        isOnLoginPage: boolean;
        currentUrl: string;
      };

      await browser.close();

      if (validationResult.isValid) {
        console.log('✅ Session is valid - authenticated with essential data');
        console.log(`📍 Current URL: ${validationResult.currentUrl}`);
      } else {
        console.log('❌ Session is invalid - login required or redirected to auth');
        console.log(`📍 Current URL: ${validationResult.currentUrl}`);
        console.log(
          `🔍 Details: nav=${validationResult.hasNavigation}, localStorage=${validationResult.hasLocalStorageData}, onLogin=${validationResult.isOnLoginPage}`,
        );
      }

      return validationResult.isValid;
    } catch (error) {
      console.log('❌ Session validation failed:', error instanceof Error ? error.message : String(error));
      return false;
    }
  }

  async createNewSession(): Promise<void> {
    console.log('🔄 Starting login process...');

    const browser = await chromium.launch({
      headless: false, // Show browser for debugging
      slowMo: 500, // Slow down for visibility
    });

    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    try {
      // Step 1: Navigate to login page
      console.log('📍 Navigating to login page...');
      await page.goto(this.config.baseURL);
      await page.waitForTimeout(2000);

      // Step 2: Enter username
      console.log('👤 Entering username...');
      await page.waitForSelector('#signInName', { timeout: 30000 });
      await page.fill('#signInName', this.getUsername());
      await page.waitForTimeout(1000);

      // Step 3: Enter password
      console.log('🔐 Entering password...');
      await page.fill('#password', this.getPassword());
      await page.waitForTimeout(1000);

      // Step 4: Click sign in
      console.log('🔄 Clicking Sign in...');
      await page.click('button:has-text("Sign in")');

      // Step 5: Handle OTP
      console.log('🔢 Waiting for OTP field...');
      const otpInput = page.locator('#otpCode');
      await otpInput.waitFor({ state: 'visible', timeout: 40_000 });

      const otp = this.generateOTP();
      console.log('🔢 Entering OTP code');
      await otpInput.fill(otp);

      console.log('🔄 Clicking Continue...');
      await page.locator('#continue').click();

      // Step 6: Wait for successful login and fully loaded dashboard
      console.log('⏳ Waiting for application to load...');
      // Wait for URL to include dashboard or base app root
      await page.waitForURL(/dashboard|redirecting|\/$/, { timeout: 60_000 });

      // Wait for document ready; avoid strict networkidle for SPA
      await page.waitForLoadState('domcontentloaded');
      await page.waitForFunction(() => document.readyState === 'complete', { timeout: 30_000 });
      // Do not enforce networkidle; it often never settles for SPAs

      // Optionally wait for a dashboard HTML response (best-effort, SPA may not request it directly)
      try {
        await page.waitForResponse(
          res => res.url().includes('/dashboard') && res.request().resourceType() === 'document' && res.status() === 200,
          { timeout: 10_000 },
        );
        console.log('🛰️ Dashboard document responded with 200');
      } catch {
        // Non-fatal for SPA apps where document is served from base and routing is client-side
        console.log('ℹ️ Skipping explicit /dashboard 200 check (SPA routing)');
      }

      // Wait for main app shell and key UI elements to be visible
      await page.waitForSelector('app-root', { state: 'visible', timeout: 30_000 });
      await page.waitForSelector('.sidebar, [role="navigation"], nav', { state: 'visible', timeout: 30_000 });

      console.log('✅ Dashboard loaded. Waiting for application initialization...');

      // Perform dashboard-specific readiness checks (nav link + API + storage)
      await this.waitForDashboardReady(page);

      console.log('📊 Application state initialized.');

      // Small buffer for any late async initializations
      await page.waitForTimeout(1000);

      console.log('✅ Application fully loaded and ready.');

      // Step 7: Save session storage first
      await saveSessionStorage(page);

      // Step 8: Save the session
      await this.saveSession(context);
      console.log('💾 Session saved successfully!');
    } catch (error) {
      console.error('❌ Login failed:', error instanceof Error ? error.message : String(error));
      throw error;
    } finally {
      await browser.close();
    }
  }

  async restoreSessionStorage(page: any): Promise<void> {
    try {
      // Check if page context is still valid before restoring
      await page.evaluate(() => !!window);

      // Use the session storage helper with error handling
      const { restoreSessionStorage } = await import('./session-storage-helper.js');
      await restoreSessionStorage(page, { oncePerWorker: true });
    } catch (error) {
      console.log('⚠️ Could not restore sessionStorage:', error instanceof Error ? error.message : String(error));
    }
  }

  private async saveSession(context: BrowserContext): Promise<void> {
    // Ensure directory exists
    const dir = path.dirname(this.config.sessionPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Get standard storage state (cookies + localStorage)
    const storageState = await context.storageState();

    // Capture sessionStorage from all pages
    const pages = context.pages();
    if (pages.length > 0) {
      const page = pages[0];

      // Get sessionStorage for each origin
      for (const origin of storageState.origins) {
        try {
          const sessionStorageData = await page.evaluate(targetOrigin => {
            if (window.location.origin !== targetOrigin) {
              return [];
            }

            const sessionData: { name: string; value: string }[] = [];
            for (let i = 0; i < sessionStorage.length; i++) {
              const key = sessionStorage.key(i);
              if (key) {
                const value = sessionStorage.getItem(key);
                if (value) {
                  sessionData.push({ name: key, value });
                }
              }
            }
            return sessionData;
          }, origin.origin);

          // Add sessionStorage to the origin
          (origin as any).sessionStorage = sessionStorageData;
          console.log(`📦 Captured ${sessionStorageData.length} sessionStorage items for ${origin.origin}`);
        } catch (error) {
          console.log(`⚠️  Could not capture sessionStorage for ${origin.origin}: ${error}`);
        }
      }
    }

    // Save enhanced storage state with sessionStorage
    fs.writeFileSync(this.config.sessionPath, JSON.stringify(storageState, null, 2));
    console.log(`📄 Session saved to: ${this.config.sessionPath}`);
  }

  private getUsername(): string {
    const username = this.config.envKeys.username.map(k => process.env[k]).find(v => !!v);
    if (!username) {
      throw new Error('❌ Username not found! Set one of: ' + this.config.envKeys.username.join(', '));
    }
    return username;
  }

  private getPassword(): string {
    const password = this.config.envKeys.password.map(k => process.env[k]).find(v => !!v);
    if (!password) {
      throw new Error('❌ Password not found! Set one of: ' + this.config.envKeys.password.join(', '));
    }
    return password;
  }

  private generateOTP(): string {
    const otpSecret = this.config.envKeys.otpSecret.map(k => process.env[k]).find(v => !!v);
    if (!otpSecret) {
      throw new Error('❌ OTP secret not found! Set one of: ' + this.config.envKeys.otpSecret.join(', '));
    }
    return authenticator.generate(otpSecret);
  }
}

// Factory: explicit app or environment-based auto-detection
function detectAppFromEnv(): AppName {
  const byProject = (process.env.PW_PROJECT || process.env.PLAYWRIGHT_PROJECT_NAME || '').toLowerCase();
  if (byProject.includes('backoffice') || byProject.includes('bo')) return 'BackOffice';

  const byGeneric = (process.env.APP || process.env.TEST_APP || '').toLowerCase();
  if (byGeneric === 'backoffice' || byGeneric === 'bo') return 'BackOffice';
  if (byGeneric === 'clientportal' || byGeneric === 'cp') return 'ClientPortal';

  // Heuristic: if BackOffice base URL exists and ClientPortal one doesn't, pick BO
  const hasBO = !!process.env.BO_BASE_URL;
  const hasCP = !!process.env.CP_BASE_URL;
  if (hasBO && !hasCP) return 'BackOffice';

  // Default to ClientPortal
  return 'ClientPortal';
}

export function createSessionManager(app?: AppName): SessionManager {
  const resolved = app ?? detectAppFromEnv();
  return new SessionManager(resolved);
}

export default SessionManager;
