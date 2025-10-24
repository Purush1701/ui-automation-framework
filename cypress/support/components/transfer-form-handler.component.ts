class TransferFormHandler {
  constructor(private formFields: Cypress.Chainable) {}

  selectDropdownOption(fieldIndex: number) {
    this.formFields.eq(fieldIndex).click();
    cy.get('.dropdown-menu__options').find('option').first().click();
  }

  selectFromBankAccount() {
    this.selectDropdownOption(0);
  }

  selectToAccount() {
    this.selectDropdownOption(1);
  }

  enterAmount(amount: string) {
    this.formFields.eq(2).find('input').type(amount);
  }

  selectSourceOfFunds() {
    this.selectDropdownOption(3);
  }
}

export default TransferFormHandler;
