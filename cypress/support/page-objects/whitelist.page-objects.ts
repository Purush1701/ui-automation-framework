import { clickButton, selectDateOfBirth, selectDropDownByText } from '../../support/utility/common-utility.ts';
import WhitelistOwnAccountPage from './whitelist-ownAccount.page-object.ts';
import WhitelistCryptoAccountPage from './whitelist-cryptoAccount.page-objects.ts';
import WhitelistThirdPartyAccountPage from './whitelist-thirdParty.page-object.ts';

class WhitelistPage {
  constructor() {
    this.clickWhitelistPage();
    this.waitForPageLoad();
  }

  //WHitelist Page
  private getAppBankAccountsElement() {
    return cy.get('app-bank-accounts');
  }

  private getwhitelistPageElement() {
    return cy.get('app-whitelist-layout');
  }

  private getAddWhitelistElement() {
    return cy.get('app-add-account-selection');
  }

  clickWhitelistPage() {
    cy.get('.sidebar__footer').contains('Whitelist').click();
    this.getwhitelistPageElement().should('be.visible');
  }

  waitForPageLoad() {
    this.getwhitelistPageElement().should('be.visible');
    this.getAppBankAccountsElement().should('be.visible');
  }

  clickAddAccount() {
    clickButton('Add Account');
    this.getAddWhitelistElement().should('be.visible');
  }

  selectAccount(type: 'Crypto Wallet' | 'Bank Account') {
    this.getAddWhitelistElement().find('.white-list-modal__toggle-item').contains(type).click();
  }

  selectOwnAccount() {
    this.getAddWhitelistElement().find('.white-list-modal__ownership-dropdown').contains('My Own Account').click();
    return new WhitelistOwnAccountPage();
  }

  selectOwnership(type: 'My Own Account' | 'Third Party Account') {
    this.getAddWhitelistElement().find('.white-list-modal__ownership-dropdown').contains(type).click();
  }

  selectClienttype(type: 'Individual' | 'Business') {
    this.getAddWhitelistElement().get('app-toggle-item-container').contains(type).click();
  }

  deleteWhitelistAccount() {
    // Intercept DELETE request for whitelist deletion
    cy.intercept('DELETE', '**/whitelist/third-party/**').as('deleteWhitelistAccount');
    // Wait for the button to be interactable and click it
    cy.contains('Account Holder Name').should('be.visible', { timeout: 10000 });

    cy.get('button icon[name="deleteBinLine"]', { timeout: 10000 })
      .should('exist')
      .should('be.visible')
      .should('not.be.disabled')
      .click({ force: true });
    // Confirm action
    clickButton('Yes, proceed');
    // Wait for DELETE request and assert response status
    cy.wait('@deleteWhitelistAccount').its('response.statusCode').should('eq', 204);
  }

  clickNextButton() {
    clickButton('Next');
  }

  openOwnAccountPage() {
    return cy.wrap(new WhitelistOwnAccountPage());
  }

  openCryptoAccountPage() {
    return cy.wrap(new WhitelistCryptoAccountPage());
  }

  openThirdPartyAccountPage() {
    return cy.wrap(new WhitelistThirdPartyAccountPage());
  }
}

export default WhitelistPage;
