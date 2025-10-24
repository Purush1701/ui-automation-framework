// __generated__ from src/app/asset-transfer/asset-transfer-routing.module.ts at 2025-09-19T10:00:00Z
import { ButtonWrapper } from '@companyName/ng-sdk/testing';
import { Page } from '@playwright/test';

import { ApplicationPage } from './application.page';

/**
 * Asset Transfer Page Object - Handles asset transfer functionality
 */
export class AssetTransferPage extends ApplicationPage {
  constructor(page: Page) {
    super(page);
  }

  // Create account button
  get createAccountButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, '.asset-transfer__create-acc');
  }

  // Create instruction button
  get createInstructionButton(): ButtonWrapper {
    return new ButtonWrapper(this.page, 'app-select-asset-transfer-flow button:has-text("Create instruction")');
  }

  // Helper method for instruction selection elements
  private getTransferButton(buttonText: string): ButtonWrapper {
    return new ButtonWrapper(this.page, `toggle-group button:has-text("${buttonText}")`);
  }

  // Instruction selection elements
  get transferInButton(): ButtonWrapper {
    return this.getTransferButton('Transfer-In');
  }

  get transferOutButton(): ButtonWrapper {
    return this.getTransferButton('Transfer-Out');
  }

  get rsnTransferButton(): ButtonWrapper {
    return this.getTransferButton('RSN Transfer');
  }

  get thirdPartyTransferButton(): ButtonWrapper {
    return this.getTransferButton('Third Party Transfer');
  }

  // Instruction selection methods
  async selectTransferIn(): Promise<void> {
    await this.transferInButton.click();
  }

  async selectTransferOut(): Promise<void> {
    await this.transferOutButton.click();
  }

  async selectRsnTransfer(): Promise<void> {
    await this.rsnTransferButton.click();
  }

  async selectThirdPartyTransfer(): Promise<void> {
    await this.thirdPartyTransferButton.click();
  }
}
