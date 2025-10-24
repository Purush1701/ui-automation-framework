import { test, expect } from '@playwright/test';
import { SidebarNavigationPage, AssetTransferPage } from '../pages';
import { baseLogin } from '../utils/base-login';
import transferInData from '../fixtures/transfer-in.json' with { type: 'json' };

test.describe('Sample Asset Transfer Tests', () => {
  // Declare page objects
  let sidebarNav: SidebarNavigationPage;
  let assetTransferPage: AssetTransferPage;

  // Initialize test data
  const testData = transferInData.createTransferInFiat;

  // Set up before each test
  test.beforeEach(async ({ page }) => {
    console.log('🚀 Setting up sample test - performing authentication...');

    // Restore session or perform fresh login
    await baseLogin(page);

    // Initialize page objects
    sidebarNav = new SidebarNavigationPage(page);
    assetTransferPage = new AssetTransferPage(page);

    // Wait for sidebar to be ready
    await sidebarNav.waitForSidebarToLoad();

    console.log('✅ Sample test setup completed');
  });

  test('should navigate to asset transfer page', async ({ page }) => {
    console.log('🚀 Testing navigation to asset transfer page...');

    // Navigate to asset transfer page
    await sidebarNav.navigateToAssetTransfer();

    // Wait for asset transfer page to load
    await assetTransferPage.waitForLoad({
      timeout: 10000,
      requiredElement: 'app-select-asset-transfer-flow',
    });

    // Verify page elements are present
    await expect(page.locator('toggle-group')).toBeVisible();
    await expect(page.locator('button:has-text("Create instruction")')).toBeVisible();

    console.log('✅ Asset transfer page navigation test completed');
  });

  test('should select transfer-in option', async ({ page }) => {
    console.log('🚀 Testing transfer-in option selection...');

    // Navigate to asset transfer page
    await sidebarNav.navigateToAssetTransfer();

    // Wait for asset transfer page to load
    await assetTransferPage.waitForLoad({
      timeout: 10000,
      requiredElement: 'app-select-asset-transfer-flow',
    });

    // Select transfer-in option
    await assetTransferPage.selectTransferIn();

    // Verify selection
    await expect(assetTransferPage.transferInButton.locator).toHaveClass(/active/);

    console.log('✅ Transfer-in selection test completed');
  });

  test('should validate transfer form elements', async ({ page }) => {
    console.log('🚀 Testing transfer form validation...');

    // Navigate to asset transfer page
    await sidebarNav.navigateToAssetTransfer();

    // Wait for asset transfer page to load
    await assetTransferPage.waitForLoad({
      timeout: 10000,
      requiredElement: 'app-select-asset-transfer-flow',
    });

    // Select transfer-in option
    await assetTransferPage.selectTransferIn();

    // Proceed to create instruction
    await assetTransferPage.createInstructionButton.click();

    // Wait for form to load
    await page.waitForSelector('form.asset-transfer-form', { timeout: 20000 });

    // Validate form elements are present
    await expect(page.locator('input[name="amount"]')).toBeVisible();
    await expect(page.locator('select[name="fromBankAccount"]')).toBeVisible();
    await expect(page.locator('select[name="toAccount"]')).toBeVisible();
    await expect(page.locator('select[name="sourceOfFunds"]')).toBeVisible();

    console.log('✅ Transfer form validation test completed');
  });

  test('should fill transfer form with sample data', async ({ page }) => {
    console.log('🚀 Testing transfer form filling with sample data...');

    // Navigate to asset transfer page
    await sidebarNav.navigateToAssetTransfer();

    // Wait for asset transfer page to load
    await assetTransferPage.waitForLoad({
      timeout: 10000,
      requiredElement: 'app-select-asset-transfer-flow',
    });

    // Select transfer-in option
    await assetTransferPage.selectTransferIn();

    // Proceed to create instruction
    await assetTransferPage.createInstructionButton.click();

    // Wait for form to load
    await page.waitForSelector('form.asset-transfer-form', { timeout: 20000 });

    // Fill form with sample data
    await page.fill('input[name="amount"]', testData.amount);
    await page.selectOption('select[name="fromBankAccount"]', testData.fromBankAccount_Id);
    await page.selectOption('select[name="toAccount"]', testData.toAccount_Id);
    await page.selectOption('select[name="sourceOfFunds"]', 'salary');

    // Verify form is filled
    await expect(page.locator('input[name="amount"]')).toHaveValue(testData.amount);

    console.log('✅ Transfer form filling test completed');
  });

  test('should validate sidebar navigation', async ({ page }) => {
    console.log('🚀 Testing sidebar navigation...');

    // Test various sidebar navigation options
    await sidebarNav.navigateToOverview();
    await expect(page).toHaveURL(/.*dashboard/);

    await sidebarNav.navigateToAssetHoldings();
    await expect(page).toHaveURL(/.*asset-holdings/);

    await sidebarNav.navigateToActivity();
    await expect(page).toHaveURL(/.*activity/);

    await sidebarNav.navigateToAssetTransfer();
    await expect(page).toHaveURL(/.*asset-transfer/);

    console.log('✅ Sidebar navigation test completed');
  });
});
