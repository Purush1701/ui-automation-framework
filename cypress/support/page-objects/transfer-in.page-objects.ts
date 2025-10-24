import { clickButton, selectDropDownByText, selectFirstDropdown, enterInputValue } from '../utility/common-utility.ts';

class TransferInPage {
  //FIAT Transfer In
  private getTransferInFiatElement() {
    return cy.get('app-transfer-in-fiat', { timeout: 10000 });
  }

  selectFromBankAccount(fromAccount: string) {
    selectDropDownByText(this.getTransferInFiatElement, 0, fromAccount);
  }

  selectToAccount() {
    selectFirstDropdown(this.getTransferInFiatElement, 1);
  }

  enterTransferInAmount(amount: string) {
    enterInputValue(this.getTransferInFiatElement, 2, amount);
  }

  selectSourceOfFunds() {
    selectFirstDropdown(this.getTransferInFiatElement, 3);
  }

  clickNextButton() {
    clickButton('Next');
  }

  clickSubmitButton() {
    clickButton('Submit');
  }
}

export default TransferInPage;
