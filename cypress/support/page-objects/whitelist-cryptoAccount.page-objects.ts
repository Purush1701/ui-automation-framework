import {
  clickButton,
  validateSnackBarMessage,
  validateStatusLabel,
  getFormFields,
  selectFirstDropdown,
  enterInputValue,
} from '../../support/utility/common-utility.ts';
import { SNACKBAR_MESSAGES } from '../../support/constants/messages.ts';

class WhitelistCryptoAccountPage {
  //Crypto Wallet Account
  private getCryptoAccountElement() {
    return cy.get('app-crypto-wallet', { timeout: 10000 });
  }

  private getWalletInfoFormFields() {
    return this.getCryptoAccountElement().find('form-field');
  }

  private getFormFields(getElement: () => Cypress.Chainable) {
    return getFormFields(getElement);
  }

  selectCryptoCurrency() {
    this.getCryptoAccountElement().should('be.visible');
    selectFirstDropdown(this.getCryptoAccountElement, 0);
  }

  enterWalletAddress(walletAddress: string) {
    enterInputValue(this.getCryptoAccountElement, 1, walletAddress);
  }

  enterWalletAlias(alias: string) {
    enterInputValue(this.getCryptoAccountElement, 2, alias);
  }

  clickWalletSubmitButton() {
    cy.intercept('POST', '**/whitelist/crypto').as('cryptoWalletAccount');
    clickButton('Submit');
    cy.wait('@cryptoWalletAccount').its('response.statusCode').should('eq', 200);
  }

  validateSuccessMsg() {
    validateSnackBarMessage(SNACKBAR_MESSAGES.CRYPTO_WALLET_WHITELISTED);
  }

  validateWalletStatus(status: string) {
    validateStatusLabel(status);
  }

  clickNextButton() {
    clickButton('Next');
  }

  deleteCryptoWalletAccount() {
    cy.intercept('DELETE', '**/whitelist/crypto/**').as('deleteWhitelistAccount');
    cy.get('button icon[name="deleteBinLine"]').click();
    clickButton('Yes, proceed');
    cy.wait('@deleteWhitelistAccount').its('response.statusCode').should('eq', 204);
  }
}

export default WhitelistCryptoAccountPage;
