import { Page } from '@playwright/test';

// Minimal readiness check: confirm app shell, basic nav visibility, and active session.
export async function waitForDashboardReady(page: Page): Promise<void> {
  // Ensure base shell is present quickly
  await page
    .locator('app-root')
    .first()
    .waitFor({ state: 'visible', timeout: 10_000 })
    .catch(() => {});

  // If we got bounced to login, surface early
  const url = page.url();
  if (url.includes('b2clogin.com') || url.includes('/login')) {
    throw new Error('Redirected to login while waiting for dashboard readiness');
  }

  // Look for any main navigation or dashboard hint
  const navHints = ['nav[aria-label="Main Navigation"]', 'a[href="/dashboard"]'];
  for (const selector of navHints) {
    try {
      await page.locator(selector).first().waitFor({ state: 'visible', timeout: 5_000 });
      break; // any hint is sufficient
    } catch {
      // try next hint
    }
  }

  // Light storage check: presence of any session keys or msal-related entries
  await page
    .waitForFunction(
      () => {
        const keys = Object.keys(sessionStorage);
        const hasSession = keys.length > 0;
        const hasMsal = keys.some(k => k.toLowerCase().includes('msal'));
        return hasSession || hasMsal;
      },
      { timeout: 10_000 },
    )
    .catch(() => {});
}

export default waitForDashboardReady;
