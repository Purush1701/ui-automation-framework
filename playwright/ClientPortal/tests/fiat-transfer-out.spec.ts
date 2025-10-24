import { test } from '@playwright/test';
import { SidebarNavigationPage, AssetTransferPage, CreateInstructionTransferOutPage } from '../pages';
import { baseLogin } from '../utils/base-login';
import transferOutData from '../fixtures/transfer-out.json' with { type: 'json' };
import { FormWrapper } from '@companyName/ng-sdk/testing';

test.describe('Asset Transfer > Transfer-Out Flow', () => {
  // Declare page objects
  let sidebarNav: SidebarNavigationPage;
  let assetTransferPage: AssetTransferPage;
  let createInstructionPage: CreateInstructionTransferOutPage;

  //Initialize test data
  const testData = transferOutData.createTransferOutFiat;

  // Set up before each test
  test.beforeEach(async ({ page }) => {
    console.log('🚀 Setting up test - performing authentication...');

    // Restore session or perform fresh login
    await baseLogin(page);

    // Initialize page objects
    sidebarNav = new SidebarNavigationPage(page);
    assetTransferPage = new AssetTransferPage(page);
    createInstructionPage = new CreateInstructionTransferOutPage(page);

    // Wait for sidebar to be ready
    await sidebarNav.waitForSidebarToLoad();

    console.log('✅ Test setup completed');
  });

  test('should complete transfer-out instruction creation flow', async ({ page }) => {
    const purposeOfTransferOptions = testData.purposeOfTransferOptions;
    const randomPurposeOfTransfer = purposeOfTransferOptions[Math.floor(Math.random() * purposeOfTransferOptions.length)];

    console.log('🚀 Starting transfer-out instruction creation flow...');

    // Navigate to asset transfer page
    await sidebarNav.navigateToAssetTransfer();

    // Wait for asset transfer page to load with custom options
    await assetTransferPage.waitForLoad({
      timeout: 10000,
      requiredElement: 'app-select-asset-transfer-flow',
    });

    // Select transfer-out option
    await assetTransferPage.selectTransferOut();

    // Proceed to create instruction
    await assetTransferPage.createInstructionButton.click();

    await page.waitForSelector('form.asset-transfer-form', { timeout: 20000 });

    console.log('📝 Form is ready, starting to fill transfer-out instruction...');

    // Fill the complete transfer-out form
    console.log(
      `📝 Random purpose of transfer: ${randomPurposeOfTransfer}, ${testData.amount}, ${testData.fromAccount_Id}, ${testData.toAccount_Id}`,
    );

    // Use the FormConfig from the page instance
    const transferOutDetailsForm = await FormWrapper.create(page, createInstructionPage.transferOutFiatDetailsFormConfig);

    await transferOutDetailsForm.fillControls({
      Amount: testData.amount,
      'From my account': testData.fromAccount_Id,
      'To bank account': testData.toAccount_Id,
      'Purpose of transfer': randomPurposeOfTransfer,
      'Instruction notes': 'This is a test Transfer-Out instruction for automated testing purposes.',
    });

    await createInstructionPage.clickNextButton();

    console.log('✅ Submitting instruction...');

    // Submit instruction with fee validation and instruction notes check
    await createInstructionPage.submitInstructionWithValidation();

    console.log('🎉 Transfer-out instruction creation completed successfully!');
  });
});
