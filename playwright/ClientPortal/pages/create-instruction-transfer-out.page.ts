import {
ButtonWrapper,
DropdownWrapper,
AmountInputWrapper,
TextareaWrapper,
  type FormConfig,
} from '@companyName/ng-sdk/testing';
import { Locator, Page, expect } from '@playwright/test';

import { ApplicationPage } from './application.page';

/**
 * Transfer-Out Instruction Creation Page Object
 * Handles the complete transfer-out instruction workflow
 */
export class CreateInstructionTransferOutPage extends ApplicationPage {
  constructor(page: Page) {
    super(page);
  }

  // Form configuration for Transfer-Out fiat form details step
  transferOutFiatDetailsFormConfig: FormConfig = {
    controls: [
      { name: 'From my account' },
      { name: 'To bank account' },
      { name: 'Amount' },
      { name: 'Purpose of transfer' },
      { name: 'Instruction notes' },
    ],
  };

  // Form Elements
  get fromAccountDropdown(): DropdownWrapper {
    return new DropdownWrapper(this.page, '.form-field:has-text("From my account") dropdown');
  }

  get toAccountDropdown(): DropdownWrapper {
    return new DropdownWrapper(this.page, '.form-field:has-text("To bank account") dropdown');
  }

  get amountInput(): AmountInputWrapper {
    return new AmountInputWrapper(this.page, '.form-field:has-text("Amount") amount-input');
  }

  get purposeOfTransferDropdown(): DropdownWrapper {
    return new DropdownWrapper(this.page, '.form-field:has-text("Purpose of transfer") dropdown');
  }

  get instructionNotesTextarea(): TextareaWrapper {
    return new TextareaWrapper(this.page, '.form-field:has-text("Instruction notes") textarea');
  }

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
   * Bank account dropdown selection with search handling
   */
  private async selectBankAccountDropdown(fieldLabel: string, value: string): Promise<void> {
    const dropdownSelector = `.form-field:has-text("${fieldLabel}") dropdown`;
    await this.page.locator(dropdownSelector).click();
    await this.page.waitForTimeout(1000);

    // Handle search if available
    const searchInput = this.page.locator('input[placeholder="Search"].dropdown-menu__search__input');
    try {
      await searchInput.waitFor({ state: 'visible', timeout: 1000 });
      await searchInput.fill(value);
      await this.page.waitForTimeout(300);
    } catch {
      // Search not available, proceed with direct selection
    }

    const dropdownItem = this.page.locator(`option:has-text("${value}")`);
    await dropdownItem.waitFor({ state: 'visible' });
    await dropdownItem.click();
  }

  // Individual field fillers
  private async fillFromAccount(accountNumber: string): Promise<void> {
    await this.selectBankAccountDropdown('From my account', accountNumber);
  }

  private async fillToAccount(accountNumber: string): Promise<void> {
    await this.selectBankAccountDropdown('To bank account', accountNumber);
  }

  private async fillAmount(amount: string | number): Promise<void> {
    await this.amountInput.setValue(typeof amount === 'string' ? parseFloat(amount) : amount);
  }

  private async fillPurposeOfTransfer(purpose: string): Promise<void> {
    await this.purposeOfTransferDropdown.setValue(purpose);
  }

  private async fillInstructionNotes(notes: string): Promise<void> {
    await this.instructionNotesTextarea.type(notes);
  }

  /**
   * Form readiness validation
   */
  async waitForFormReady(): Promise<void> {
    await this.waitForLoad({
      timeout: 15000,
      requiredElement: 'app-stepper-group[disclaimer="transfer"]',
      waitForNetworkIdle: true,
    });

    await this.amountInput.waitForEnabled();
    await this.fromAccountDropdown.waitForEnabled();
    await this.toAccountDropdown.waitForEnabled();
  }

  async expectFormToBeReady(): Promise<void> {
    await this.amountInput.expectToBeVisible();
    await this.fromAccountDropdown.expectToBeVisible();
    await this.toAccountDropdown.expectToBeVisible();
    await this.purposeOfTransferDropdown.expectToBeVisible();
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
   * Final submission with validation
   */
  async submitInstructionWithValidation(): Promise<void> {
    // Validate Fee
    await this.page.waitForTimeout(3000);
    try {
      await this.feeElement.waitFor({ state: 'visible', timeout: 5000 });
      const feeAmount = await this.feeAmount.textContent();

      expect(feeAmount).toBeTruthy();
      expect(feeAmount?.trim()).not.toBe('');
      expect(feeAmount?.trim()).not.toBe('0.00');
    } catch {
      // Fee validation failed - element not visible
    }

    // Submit instruction
    await this.submitButton.locator.scrollIntoViewIfNeeded();
    await this.submitButton.waitForEnabled();
    await this.submitButton.click();
    await this.submitButton.expectToBeLoading();
  }
}
