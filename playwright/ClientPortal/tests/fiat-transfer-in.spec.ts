import { test } from '@playwright/test';
import { SidebarNavigationPage, AssetTransferPage, CreateInstructionPage } from '../pages';
import { baseLogin } from '../utils/base-login';
import transferInData from '../fixtures/transfer-in.json' with { type: 'json' };
import { FormWrapper } from '@companyName/ng-sdk/testing';

test.describe('Asset Transfer > Transfer-In Flow', () => {
  // Declare page objects
  let sidebarNav: SidebarNavigationPage;
  let assetTransferPage: AssetTransferPage;
  let createInstructionPage: CreateInstructionPage;

  //Initialize test data
  const testData = transferInData.createTransferInFiat;
  const randomSourceOfFunds = testData.sourceOfFunds[Math.floor(Math.random() * testData.sourceOfFunds.length)];

  // Set up before each test
  test.beforeEach(async ({ page }) => {
    console.log('🚀 Setting up test - performing authentication...');

    // Restore session or perform fresh login
    await baseLogin(page);

    // Initialize page objects
    sidebarNav = new SidebarNavigationPage(page);
    assetTransferPage = new AssetTransferPage(page);
    createInstructionPage = new CreateInstructionPage(page);

    // Wait for sidebar to be ready
    await sidebarNav.waitForSidebarToLoad();

    console.log('✅ Test setup completed');
  });

  test('should complete transfer-in instruction creation flow', async ({ page }) => {
    console.log('🚀 Starting transfer-in instruction creation flow...');

    // Navigate to asset transfer page
    await sidebarNav.navigateToAssetTransfer();

    // Wait for asset transfer page to load with custom options
    await assetTransferPage.waitForLoad({
      timeout: 10000,
      requiredElement: 'app-select-asset-transfer-flow',
    });

    // Select transfer-in option
    await assetTransferPage.selectTransferIn();

    // Proceed to create instruction
    await assetTransferPage.createInstructionButton.click();

    await page.waitForSelector('form.asset-transfer-form', { timeout: 20000 });

    console.log('📝 Form is ready, starting to fill transfer-in instruction...');

    // Fill the complete transfer-in form
    console.log(
      `📝 Random source of funds: ${randomSourceOfFunds}, ${testData.amount}, ${testData.fromBankAccount}, ${testData.toAccount}`,
    );

    // Use the FormConfig from the page instance
    const transferInDetailsForm = await FormWrapper.create(page, createInstructionPage.transferInFiatDetailsFormConfig);

    await transferInDetailsForm.fillControls({
      Amount: testData.amount,
      'From bank account': testData.fromBankAccount_Id,
      'To my account': testData.toAccount_Id,
      'Source of funds': randomSourceOfFunds,
    });

    await createInstructionPage.clickNextButton();

    console.log('📝 Form step 1 completed, filling additional information...');

    const transferInAdditionalInfoFormConfig = await FormWrapper.create(
      page,
      createInstructionPage.transferInAdditionalInfoFormConfig,
    );

    await transferInAdditionalInfoFormConfig.fillControls({
      'Instruction notes': 'This is a test Transfer-In instruction for automated testing purposes.',
      'Additional Documents': ['playwright/ClientPortal/fixtures/documents/upload_PDF_Sample.pdf'],
    });

    await transferInAdditionalInfoFormConfig.setDocumentType('Additional Documents', 'upload_PDF_Sample.pdf', 'bank-statement');

    await createInstructionPage.clickNextButton();

    console.log('✅ All form sections filled successfully');

    console.log('✅ Submitting instruction...');

    // Submit instruction with fee validation and instruction notes check
    await createInstructionPage.submitInstructionWithValidation();

    console.log('🎉 Transfer-in instruction creation completed successfully!');
  });
});
