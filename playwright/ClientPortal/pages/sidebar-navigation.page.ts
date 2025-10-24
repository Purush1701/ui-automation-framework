import { ButtonWrapper } from '@companyName/ng-sdk/testing';
import { Locator, Page } from '@playwright/test';

import { ApplicationPage } from './application.page';

/**
 * Sidebar Navigation Page Object - Handles all sidebar navigation functionality
 */
export class SidebarNavigationPage extends ApplicationPage {
  constructor(page: Page) {
    super(page);
  }

  // Sidebar container
  get sidebar(): Locator {
    return this.page.locator('.sidebar');
  }

  // Main navigation items
  get overviewNavButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'a[href="/dashboard"]');
  }

  get assetHoldingsNavButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'a[href="/asset-holdings"]');
  }

  get activityNavButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'a[href="/activity"]');
  }

  // Instructions section
  get assetTransferNavButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'a[href="/asset-transfer"]');
  }

  get otcNavButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'a[href="/otc"]');
  }

  // Footer navigation items
  get whitelistNavButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'a[href="/whitelist"]');
  }

  get clientNavButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'button[routerlink="/client"]');
  }

  // Navigation methods
  async navigateToOverview(): Promise<void> {
    await this.overviewNavButton.click();
    await this.waitForLoad();
  }

  async navigateToAssetHoldings(): Promise<void> {
    await this.assetHoldingsNavButton.click();
    await this.waitForLoad();
  }

  async navigateToActivity(): Promise<void> {
    await this.activityNavButton.click();
    await this.waitForLoad();
  }

  async navigateToAssetTransfer(): Promise<void> {
    await this.assetTransferNavButton.click();
    await this.waitForLoad();
  }

  async navigateToOtc(): Promise<void> {
    await this.otcNavButton.click();
    await this.waitForLoad();
  }

  async navigateToWhitelist(): Promise<void> {
    await this.whitelistNavButton.click();
    await this.waitForLoad();
  }

  async navigateToClient(): Promise<void> {
    await this.clientNavButton.click();
    await this.waitForLoad();
  }

  // Utility methods
  async isSidebarVisible(): Promise<boolean> {
    return await this.sidebar.isVisible();
  }

  async waitForSidebarToLoad(): Promise<void> {
    await this.sidebar.waitFor({ state: 'visible' });
    await this.overviewNavButton.locator.waitFor({ state: 'visible' });
  }
}
