import { Page } from '@playwright/test';
import { existsSync, readFileSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve paths relative to the playwright root directory
const playwrightRoot = resolve(__dirname, '..');
const getFixturesPath = (filename: string) => join(playwrightRoot, 'ClientPortal', 'fixtures', filename);

type RestoreOptions = {
  quiet?: boolean; // suppress logs when true
  oncePerWorker?: boolean; // print logs only on first invocation per worker
};

let printedOnce = false;

function shouldLog(options?: RestoreOptions): boolean {
  const envVerbose = process.env.SESSION_LOGS === '1' || process.env.PLAYWRIGHT_VERBOSE_SESSIONS === '1';
  const quiet = options?.quiet ?? false;
  const oncePerWorker = options?.oncePerWorker ?? false;
  if (quiet) return false;
  if (oncePerWorker && printedOnce) return false;
  return true || envVerbose; // keep default behavior verbose; env can be used later if desired
}

function markPrinted(options?: RestoreOptions) {
  if (options?.oncePerWorker) printedOnce = true;
}

/**
 * Restore session storage data that MSAL needs to recognize authentication
 */
export async function restoreSessionStorage(page: Page, options?: RestoreOptions): Promise<void> {
  // Quick page context check without expensive evaluation
  try {
    if (page.isClosed()) {
      console.log('⚠️ Page is closed, skipping session storage restoration');
      return;
    }
  } catch (error) {
    console.log('⚠️ Page context check failed, skipping session storage restoration');
    return;
  }

  // Prefer reading from enhanced storage state (session.json) for current origin
  const storageStatePath = getFixturesPath('session/session.json');
  let restored = false;

  try {
    if (existsSync(storageStatePath)) {
      const storageState = JSON.parse(readFileSync(storageStatePath, 'utf-8')) as {
        origins?: Array<{ origin: string; localStorage?: any[]; sessionStorage?: Array<{ name: string; value: string }> }>;
      };

      // Determine target origin from CP_BASE_URL env or use first origin as fallback
      const baseUrl = process.env.CP_BASE_URL || '';
      const targetOrigin = baseUrl ? new URL(baseUrl).origin : undefined;
      const originEntry = storageState.origins?.find(o => (targetOrigin ? o.origin === targetOrigin : true));

      if (originEntry?.sessionStorage && originEntry.sessionStorage.length > 0) {
        const storageData = Object.fromEntries(originEntry.sessionStorage.map(item => [item.name, item.value]));

        // Simplified init script with better error handling
        try {
          await page.addInitScript((data: Record<string, string>) => {
            try {
              if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.clear();
                Object.entries(data).forEach(([k, v]) => {
                  try {
                    sessionStorage.setItem(k, v);
                  } catch (e) {
                    // Silently skip items that can't be set
                  }
                });
              }
            } catch (e) {
              // Silently handle any storage errors
            }
          }, storageData);

          if (shouldLog(options)) {
            const restoredCount = Object.keys(storageData).length;
            console.log(`✅ Restored ${restoredCount} sessionStorage items from session.json`);
            const msalKeys = Object.keys(storageData).filter(k => {
              const lc = k.toLowerCase();
              return lc.includes('msal') || lc.includes('token') || lc.includes('account');
            });
            if (msalKeys.length > 0) console.log(`🔐 MSAL keys restored: ${msalKeys.length}`);
            markPrinted(options);
          }
          restored = true;
        } catch (scriptError) {
          console.log('⚠️ Failed to add init script for session storage, continuing...');
        }
      }
    }
  } catch (e) {
    console.log('ℹ️ Could not read session.json for sessionStorage, continuing...');
  }

  // Skip fallback for performance - if main method fails, just continue
  if (!restored && shouldLog(options)) {
    console.log('ℹ️ Session storage restoration skipped - will rely on existing session');
  }
}

/**
 * Save session storage data for future test runs
 */
export async function saveSessionStorage(page: Page): Promise<void> {
  try {
    const sessionStorageData = await page.evaluate(() => {
      const data: Record<string, string> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          data[key] = sessionStorage.getItem(key) || '';
        }
      }
      return data;
    });

    // Ensure directory exists
    const authDir = getFixturesPath('');
    const fs = await import('fs');
    if (!fs.existsSync(authDir)) {
      fs.mkdirSync(authDir, { recursive: true });
    }

    // Save session storage
    const sessionStoragePath = getFixturesPath('session/session-storage.json');
    fs.writeFileSync(sessionStoragePath, JSON.stringify(sessionStorageData, null, 2));

    console.log(`💾 Saved ${Object.keys(sessionStorageData).length} session storage items`);
  } catch (error) {
    console.error('❌ Failed to save session storage:', error);
  }
}
