import {
  clickButton,
  selectDropDownByText,
  selectFirstDropdown,
  enterInputValue,
  getFormFields,
} from '../utility/common-utility.ts';

class RSNTransferPage {
  private getRsnFiatElement() {
    return cy.get('app-rsn-fiat', { timeout: 10000 });
  }

  selectFromAccount() {
    selectFirstDropdown(this.getRsnFiatElement, 0);
  }

  enterToAccount(accNumber: string) {
    enterInputValue(this.getRsnFiatElement, 1, accNumber);
    cy.get('.dropdown-menu__options').find('option').first().click();
  }

  enterAmount(amount: string) {
    enterInputValue(this.getRsnFiatElement, 3, amount);
  }

  selectPurposeOfTransfer() {
    selectFirstDropdown(this.getRsnFiatElement, 4);
  }

  enterInstructionNotes(notes: string) {
    getFormFields(this.getRsnFiatElement).eq(5).find('textarea').type(notes);
  }

  clickNextButton() {
    clickButton('Next');
  }

  clickSubmitButton() {
    clickButton('Submit');
  }
}

export default RSNTransferPage;
