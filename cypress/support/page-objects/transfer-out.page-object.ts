import { clickButton, selectDropDownByText, selectFirstDropdown, enterInputValue } from '../utility/common-utility.ts';

class TransferoutPage {
  //FIAT Transfer Out
  private getTransferOutFiatElement() {
    return cy.get('app-transfer-out-fiat', { timeout: 10000 });
  }

  selectFiatFromAccount() {
    this.getTransferOutFiatElement().should('be.visible');
    selectFirstDropdown(this.getTransferOutFiatElement, 0);
  }

  selectFiatToAccount(toAccount: string) {
    selectDropDownByText(this.getTransferOutFiatElement, 1, toAccount);
  }

  enterFiatAmount(amount: string) {
    enterInputValue(this.getTransferOutFiatElement, 2, amount);
  }

  selectFiatTransferPurpose() {
    selectFirstDropdown(this.getTransferOutFiatElement, 3);
  }
  enterFiatTransferNotes(notes: string) {
    this.getTransferOutFiatElement().find('form-field').eq(4).find('textarea').type(notes);
  }

  //CRYPTO Transfer Out
  private getTransferOutCryptoElement() {
    return cy.get('app-transfer-out-crypto', { timeout: 10000 });
  }

  selectCryptoFromAccount() {
    this.getTransferOutCryptoElement().should('be.visible');
    selectFirstDropdown(this.getTransferOutCryptoElement, 0);
  }

  selectCryptoToWallet(value: string) {
    selectDropDownByText(this.getTransferOutCryptoElement, 1, value);
  }

  enterCryptoAmount(amount: string) {
    enterInputValue(this.getTransferOutCryptoElement, 2, amount);
  }

  selectCryptoTransferPurpose() {
    selectFirstDropdown(this.getTransferOutCryptoElement, 3);
  }

  submitCryptoTransferNext() {
    cy.intercept('GET', '**/asset-transfer/estimated-gas-fee/**').as('estimatedFee');
    clickButton('Next');
    cy.wait('@estimatedFee', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
  }

  submitCryptoTransfer() {
    cy.intercept('POST', '**/asset-transfer/transfer-out-crypto').as('transferOut');
    clickButton('Submit');
    cy.wait('@transferOut', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
  }
}

export default TransferoutPage;
