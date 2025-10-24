import {
  clickButton,
  getFormFields,
  selectFirstDropdown,
  enterInputValue,
  selectDropDownByText,
} from '../../support/utility/common-utility.ts';

class WhitelistOwnAccountPage {
  //Own Bank Account
  private getOwnBankAccountElement() {
    return cy.get('app-own', { timeout: 10000 });
  }

  private getBankinfoElement() {
    return cy.get('app-bank-info-step', { timeout: 10000 });
  }

  private getBankInfoFormFields() {
    return this.getBankinfoElement().find('form-field');
  }

  selectBankName(bankName: string) {
    this.getBankinfoElement().should('be.visible');
    enterInputValue(this.getBankinfoElement, 1, bankName);
    // Select the Bank account
    cy.get('.dropdown-menu__options')
      .find('option')
      .contains(bankName)
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  enterAccountNumber(accNumber: string) {
    enterInputValue(this.getBankinfoElement, 3, accNumber);
  }

  enterShortCode(shortCode: string) {
    enterInputValue(this.getBankinfoElement, 4, shortCode);
  }

  enterbranchCode(branchCode: string) {
    enterInputValue(this.getBankinfoElement, 5, branchCode);
  }

  enableIntermediaryBankToggle() {
    this.getBankinfoElement().find('.slide-toggle__checkbox').check({ force: true });
  }

  selectIntermediaryBankName(bankName: string) {
    this.getOwnBankAccountElement().contains('Intermediary Bank').should('be.visible');
    enterInputValue(this.getBankinfoElement, 6, bankName);
    cy.get('.dropdown-menu__options', { timeout: 10000 }).find('option').first().click();
  }

  selectCountry() {
    selectFirstDropdown(this.getBankinfoElement, 8);
  }

  enterBankAddress(branchAddress: string) {
    enterInputValue(this.getBankinfoElement, 9, branchAddress);
  }

  clickNextButton() {
    clickButton('Next');
  }

  clickSubmitButton() {
    cy.intercept('POST', '**/whitelist/own').as('ownBankAccount');
    cy.get('button').contains('Submit', { timeout: 10000 }).should('be.enabled').click();
    cy.wait('@ownBankAccount').its('response.statusCode').should('eq', 200);
  }

  deleteOwnBankAccount() {
    cy.intercept('DELETE', '**/whitelist/own/**').as('deleteWhitelistAccount');
    cy.get('button icon[name="deleteBinLine"]').click();
    clickButton('Yes, proceed');
    cy.wait('@deleteWhitelistAccount').its('response.statusCode').should('eq', 204);
  }
}
export default WhitelistOwnAccountPage;
