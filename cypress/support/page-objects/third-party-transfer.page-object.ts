import {
  clickButton,
  selectDropDownByText,
  selectFirstDropdown,
  enterInputValue,
  getFormFields,
  uploadFile,
  verifyDropdownValueNotPresent,
} from '../utility/common-utility.ts';

class ThirdPartyTransferPage {
  // Fiat Transfer Methods
  private getFiatThirdPartyTransferElement() {
    return cy.get('app-third-party-fiat', { timeout: 10000 });
  }

  selectFiatFromAccount() {
    selectFirstDropdown(this.getFiatThirdPartyTransferElement, 0);
  }

  selectFiatDestinationAccount(toAccount: string) {
    selectDropDownByText(this.getFiatThirdPartyTransferElement, 1, toAccount);
  }

  enterFiatTransferAmount(amount: string) {
    enterInputValue(this.getFiatThirdPartyTransferElement, 2, amount);
  }

  selectFiatTransferPurpose() {
    selectFirstDropdown(this.getFiatThirdPartyTransferElement, 3);
  }

  enterFiatTransferNotes(notes: string) {
    getFormFields(this.getFiatThirdPartyTransferElement).eq(0).find('textarea').type(notes);
  }

  uploadFiatTransferDocument(fileName: string) {
    uploadFile(() => getFormFields(this.getFiatThirdPartyTransferElement).eq(1), fileName);
  }

  selectFiatDocumentType() {
    getFormFields(this.getFiatThirdPartyTransferElement).eq(1);
    cy.contains('button', 'Select document type').scrollIntoView().should('exist').click({ force: true });
    cy.get('.dropdown-menu__options').find('option').first().click();
  }

  verifyFiatDestinationAccountNotPresent(accountNumber: string) {
    verifyDropdownValueNotPresent(this.getFiatThirdPartyTransferElement, 1, accountNumber);
  }

  // Common Navigation Methods
  navigateToNextStep() {
    clickButton('Next');
  }

  submitFiatTransfer() {
    clickButton('Submit');
  }

  // Crypto Transfer Methods
  private getCryptoThirdPartyTransferElement() {
    return cy.get('app-third-party-crypto', { timeout: 10000 });
  }

  selectCryptoFromAccount() {
    selectFirstDropdown(this.getCryptoThirdPartyTransferElement, 0);
  }

  selectCryptoDestinationWallet(wallet: string) {
    selectDropDownByText(this.getCryptoThirdPartyTransferElement, 1, wallet);
  }

  enterCryptoTransferAmount(amount: string) {
    enterInputValue(this.getCryptoThirdPartyTransferElement, 2, amount);
  }

  selectCryptoTransferPurpose() {
    selectFirstDropdown(this.getCryptoThirdPartyTransferElement, 3);
  }

  clickNextButton() {
    cy.intercept('GET', '**/asset-transfer/estimated-gas-fee/**').as('estimatedFee');
    clickButton('Next');
    cy.wait('@estimatedFee', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
  }

  submitCryptoTransfer() {
    cy.intercept('POST', '**/asset-transfer/third-party-transfer-crypto').as('payments');
    clickButton('Submit');
    cy.wait('@payments', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
  }
}

export default ThirdPartyTransferPage;
