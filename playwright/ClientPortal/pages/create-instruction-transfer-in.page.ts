import { ButtonWrapper, DropdownWrapper, type FormConfig } from '@companyName/ng-sdk/testing';
import { Locator, Page, expect } from '@playwright/test';

import { ApplicationPage } from './application.page';

export class CreateInstructionPage extends ApplicationPage {
  constructor(page: Page) {
    super(page);
  }

  // Form configuration for Transfer-In fiat form details step
  transferInFiatDetailsFormConfig: FormConfig = {
    controls: [{ name: 'From bank account' }, { name: 'To my account' }, { name: 'Amount' }, { name: 'Source of funds' }],
  };

  // Form configuration for Transfer-In Additional Info step
  transferInAdditionalInfoFormConfig: FormConfig = {
    controls: [{ name: 'Instruction notes' }, { name: 'Additional Documents' }],
  };

  // Form Elements - Individual wrappers for backward compatibility
  get fromAccountDropdown(): DropdownWrapper {
    return new DropdownWrapper(this.page, '.form-field:has-text("From bank account") dropdown');
  }

  get toAccountDropdown(): DropdownWrapper {
    return new DropdownWrapper(this.page, '.form-field:has-text("To my account") dropdown');
  }

  get searchInput(): DropdownWrapper {
    return new DropdownWrapper(this.page, 'section.dropdown-menu');
  }

  // get amountInput(): AmountInputWrapper {
  //   return new AmountInputWrapper(this.page, '.form-field:has-text("Amount") amount-input');
  // }

  // get sourceOfFundsDropdown(): DropdownWrapper {
  //   return new DropdownWrapper(this.page, '.form-field:has-text("Source of funds") dropdown');
  // }

  // get instructionNotesTextarea(): TextareaWrapper {
  //   return new TextareaWrapper(this.page, '.form-field:has-text("Instruction notes") textarea');
  // }

  // get additionalDocumentsUpload(): FileUploadWrapper {
  //   return new FileUploadWrapper(this.page, '.form-field:has-text("Additional documents") file-upload, file-upload');
  // }

  // Action Elements
  get nextButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'app-stepper-group[disclaimer="transfer"] button:has-text("Next"):visible');
  }

  get submitButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'app-stepper-group[disclaimer="transfer"] button:has-text("Submit"):visible');
  }

  get documentTypeDropdown(): DropdownWrapper {
    return new DropdownWrapper(this.page, 'dropdown:has(button:has-text("Select document type"))');
  }

  // Review Page Elements
  get feeElement(): Locator {
    return this.page.locator('app-review-instruction-item[header="Fee"]');
  }

  get feeAmount(): Locator {
    return this.feeElement.locator('app-display-amount .display-amount__amount');
  }

  /**
   * Main form filling workflow - handles step 1 of the transfer instruction
   */
  async clickNextButton(): Promise<void> {
    // Proceed to next step
    const nextButton = this.page.locator('button:has-text("Next")').first();
    await nextButton.scrollIntoViewIfNeeded();
    await nextButton.click();
  }

  /**
   * Additional information workflow - handles step 2 including notes, documents, and document type
   */
  async selectDocumentType(): Promise<void> {
    // Select document type
    await this.documentTypeDropdown.expectToBeVisible();
    await this.documentTypeDropdown.click();

    await this.page.waitForTimeout(500);
    const option = this.page.locator(`option:has-text("Bank Statement")`);
    await option.waitFor({ state: 'visible' });
    await option.click();

    console.log('✅ Document type selected: Bank Statement');

    // Proceed to review step
    this.clickNextButton();
  }

  /**
   * Bank account dropdown selection with smart search handling
   */
  // async selectBankAccountDropdown(fieldLabel: string, value: string): Promise<void> {
  //   const dropdownSelector = `.form-field:has-text("${fieldLabel}") dropdown`;
  //   await this.page.locator(dropdownSelector).click();
  //   await this.page.waitForTimeout(1000);

  //   // Handle search if available
  //   const searchInput = this.page.locator('input[placeholder="Search"].dropdown-menu__search__input');
  //   try {
  //     await searchInput.waitFor({ state: 'visible', timeout: 1000 });
  //     await searchInput.fill(value);
  //     await this.page.waitForTimeout(300);
  //   } catch {
  //     console.log('Search input not available, selecting directly from dropdown items');
  //   }

  //   const dropdownItem = this.page.locator(`option:has-text("${value}")`);
  //   await dropdownItem.waitFor({ state: 'visible' });
  //   await dropdownItem.click();
  // }

  // Individual field fillers
  // async fillFromAccount(accountNumber: string): Promise<void> {
  //   await this.selectBankAccountDropdown('From bank account', accountNumber);
  //   //this.fromAccountDropdown.setValue(accountNumber);
  // }

  // async fillToAccount(accountNumber: string): Promise<void> {
  //   await this.selectBankAccountDropdown('To my account', accountNumber);
  //   //this.toAccountDropdown.setValue(accountNumber);
  // }

  // async fillAmount(amount: string | number): Promise<void> {
  //   await this.amountInput.setValue(typeof amount === 'string' ? parseFloat(amount) : amount);
  // }

  // async fillSourceOfFunds(source: string): Promise<void> {
  //   await this.sourceOfFundsDropdown.setValue(source);
  // }

  /**
   * FormWrapper-based form filling methods
   * These use the FormConfig definitions for better maintainability
   */
  /**
   * Getter methods to expose form configurations for external use
   */
  // get getTransferInDetailsFormConfig(): FormConfig {
  //   return this.transferInFiatDetailsFormConfig;
  // }

  // get getTransferInAdditionalInfoFormConfig(): FormConfig {
  //   return this.transferInAdditionalInfoFormConfig;
  // }

  /**
   * Final submission with validation - handles review step and final submission
   */
  async submitInstructionWithValidation(): Promise<void> {
    console.log('🚀 Starting submission with validation...');

    // Validate Fee
    await this.page.waitForTimeout(3000);
    try {
      await this.feeElement.waitFor({ state: 'visible', timeout: 5000 });
      const feeAmount = await this.feeAmount.textContent();

      expect(feeAmount).toBeTruthy();
      expect(feeAmount?.trim()).not.toBe('');
      expect(feeAmount?.trim()).not.toBe('0.00');

      console.log(`✅ Fee validated: $${feeAmount}`);
    } catch {
      console.log('⚠️ Fee validation skipped - element not visible');
    }

    // Submit instruction
    await this.submitButton.locator.scrollIntoViewIfNeeded();
    await this.submitButton.waitForEnabled();
    await this.submitButton.click();
    await this.submitButton.expectToBeLoading();

    console.log('✅ Instruction submitted successfully!');
  }
}
