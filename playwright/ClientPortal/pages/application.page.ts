import { Page } from '@playwright/test';

/**
 * Base Application Page
 * Common functionality for all page objects
 */
export abstract class ApplicationPage {
  protected constructor(protected page: Page) {}

  /**
   * Navigate to specific route
   */
  async navigateToRoute(route: string): Promise<void> {
    await this.page.goto(route);
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Common wait for load function for all pages
   * Combines multiple loading strategies for reliable page load detection
   */
  async waitForLoad(
    options: {
      timeout?: number;
      customLoadingSelectors?: string[];
      waitForNetworkIdle?: boolean;
      requiredElement?: string;
    } = {},
  ): Promise<void> {
    const { timeout = 10000, customLoadingSelectors = [], waitForNetworkIdle = false, requiredElement } = options;

    // Step 1: Wait for DOM content to be loaded
    await this.page.waitForLoadState('domcontentloaded');

    // Step 2: Optionally wait for network idle (useful for API-heavy pages)
    if (waitForNetworkIdle) {
      try {
        await this.page.waitForLoadState('networkidle', { timeout: timeout / 2 });
      } catch {
        // Continue if network idle times out
      }
    }

    // Step 3: Wait for common loading indicators to disappear
    const defaultLoadingSelectors = [
      '.loading',
      '.spinner',
      '.loading',
      '.loading-overlay',
      '.spinner',
      '.mat-spinner',
      ...customLoadingSelectors,
    ];

    for (const selector of defaultLoadingSelectors) {
      try {
        await this.page.locator(selector).waitFor({
          state: 'hidden',
          timeout: Math.min(3000, timeout / 3),
        });
      } catch {
        // Ignore if loading element doesn't exist
      }
    }

    // Step 4: Wait for required element if specified
    if (requiredElement) {
      await this.page.locator(requiredElement).waitFor({
        state: 'visible',
        timeout: timeout / 2,
      });
    }

    // Step 5: Final check - ensure page is not loading
    await this.waitForLoadingToFinish(timeout / 4);
  }

  /**
   * Check if current page matches expected URL pattern
   */
  async isOnPage(urlPattern: string | RegExp): Promise<boolean> {
    const currentUrl = this.page.url();

    if (typeof urlPattern === 'string') {
      return currentUrl.includes(urlPattern);
    }

    return urlPattern.test(currentUrl);
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({
      path: `tests/screenshots/${name}.png`,
      fullPage: true,
    });
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<boolean> {
    try {
      await this.page.locator(selector).waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if element exists and is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Get current page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    // On SPA route changes, load states may not fire; avoid blocking
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Check if page has error messages
   */
  async hasErrorMessage(): Promise<boolean> {
    const errorSelectors = ['.error', '.alert-danger', '.error', '[role="alert"]'];

    for (const selector of errorSelectors) {
      if (await this.isElementVisible(selector)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get error message text if present
   */
  async getErrorMessage(): Promise<string | null> {
    const errorSelectors = ['.error', '.alert-danger', '.error', '[role="alert"]'];

    for (const selector of errorSelectors) {
      try {
        const element = this.page.locator(selector);

        if (await element.isVisible()) {
          return await element.textContent();
        }
      } catch {
        continue;
      }
    }

    return null;
  }

  /**
   * Check if page is loading
   */
  async isPageLoading(): Promise<boolean> {
    const loadingSelectors = ['.loading', '.spinner', '.loading'];

    for (const selector of loadingSelectors) {
      if (await this.isElementVisible(selector)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Wait for page to stop loading
   */
  async waitForLoadingToFinish(timeout: number = 10000): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      if (!(await this.isPageLoading())) {
        return;
      }

      await this.page.waitForTimeout(500);
    }
  }
}
