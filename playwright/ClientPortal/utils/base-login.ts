import { Page } from '@playwright/test';
import { SessionManager } from '../../utils/session-manager';

/**
 * Base login utility for restoring session in tests with fallback to new login
 */
export async function baseLogin(page: Page): Promise<void> {
  console.log('🔐 Starting authentication process...');

  const sessionManager = new SessionManager('ClientPortal');

  try {
    // Quick session check - skip expensive validation if session file is recent
    console.log('📋 Checking existing session...');
    await sessionManager.ensureSession();

    // Restore session storage for this page
    console.log('🔄 Restoring session storage...');
    await sessionManager.restoreSessionStorage(page);

    // Navigate to the application to test if session is still valid
    console.log('🌐 Navigating to application...');
    await page.goto(process.env.CP_BASE_URL!, {
      timeout: 20000,
      waitUntil: 'domcontentloaded',
    });

    // Reduced wait time for redirects
    await page.waitForTimeout(1000);

    // Check if we're on login page (indicates invalid session)
    const currentUrl = page.url();
    if (currentUrl.includes('b2clogin.com') || currentUrl.includes('/login') || currentUrl.includes('/signin')) {
      console.log('❌ Session expired, performing fresh login...');
      throw new Error('Session expired');
    }

    // Wait for authentication redirects to complete and application to be ready
    await waitForApplicationReady(page);

    console.log('✅ Authentication successful - session restored');
  } catch (error) {
    console.log('⚠️ Session restoration failed, performing fresh login...');
    console.log('Error:', error instanceof Error ? error.message : String(error));

    // Clear any existing session and create a new one
    try {
      await sessionManager.createNewSession();

      // Restore the new session for this page
      await sessionManager.restoreSessionStorage(page);

      // Navigate to application with fresh session
      await page.goto(process.env.CP_BASE_URL!, {
        timeout: 20000,
        waitUntil: 'domcontentloaded',
      });

      // Wait for authentication redirects to complete and application to be ready
      await waitForApplicationReady(page);

      console.log('✅ Fresh login successful');
    } catch (loginError) {
      console.error('❌ Fresh login failed:', loginError instanceof Error ? loginError.message : String(loginError));
      throw new Error('Authentication failed completely');
    }
  }
}

/**
 * Smart application ready check that handles authentication redirects
 * and waits for actual application content to be visible
 */
async function waitForApplicationReady(page: Page): Promise<void> {
  console.log('🔍 Waiting for application to be ready...');

  // Step 1: Wait for URL to stabilize (no more auth redirects)
  try {
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return !url.includes('b2clogin.com') && !url.includes('/logout') && !url.includes('/login') && !url.includes('/signin');
      },
      { timeout: 20000 },
    );
    console.log('✅ URL stabilized - no more auth redirects');
  } catch {
    console.log('⚠️ URL stabilization timeout - continuing anyway');
  }

  // Step 2: Wait for DOM to be ready
  await page.waitForLoadState('domcontentloaded');

  // Step 3: Wait for more specific application elements (try multiple options)
  const appReadySelectors = [
    'router-outlet', // Angular router content
    '[role="main"]', // Semantic main content
    'app-root:not([hidden])', // Non-hidden app-root
    '.sidebar, nav', // Navigation elements
  ];

  let appReady = false;
  for (const selector of appReadySelectors) {
    try {
      await page.waitForSelector(selector, { state: 'visible', timeout: 5000 });
      console.log(`✅ Application ready - found visible element: ${selector}`);
      appReady = true;
      break;
    } catch {
      // Try next selector
      continue;
    }
  }

  // Step 4: Fallback - if no specific elements found, at least ensure basic DOM structure
  if (!appReady) {
    console.log('⚠️ No specific app elements found, using fallback checks...');
    try {
      await page.waitForSelector('body', { state: 'visible', timeout: 10000 });

      // Additional check: ensure we're not on an error page
      const pageText = await page.textContent('body');
      if (pageText && !pageText.includes('Error') && !pageText.includes('404')) {
        console.log('✅ Basic application structure appears ready');
      }
    } catch {
      console.log('⚠️ Even fallback checks failed - proceeding anyway');
    }
  }

  // Step 5: Small additional wait for any final rendering
  await page.waitForTimeout(1000);
}
