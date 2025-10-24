import { validateSnackBarMessage } from './common-utility.ts';
import { SNACKBAR_MESSAGES } from '../constants/messages.ts';
import { generateRandomData } from './generateData.ts';
import WhitelistPage from '../page-objects/whitelist.page-objects.ts';

export function createWhitelistThirdPartyIndividualAccount(
  whitelistPage: WhitelistPage,
  accountData: any,
): Cypress.Chainable<{ accountNumber: string; id: string }> {
  return cy.wrap(null).then(() => {
    // Select Accounttype, Ownership,
    whitelistPage.clickAddAccount();
    whitelistPage.selectAccount('Bank Account');
    whitelistPage.selectOwnership('Third Party Account');
    whitelistPage.selectClienttype('Individual');
    whitelistPage.clickNextButton();

    const randomAccountNumber = `${Cypress._.random(10000000000)}`;

    return whitelistPage.openThirdPartyAccountPage().then(thirdPartyAccount => {
      // Fill in the Own Bank Account form -Bankname, AccountNumber, ShortCode, BranchCode
      thirdPartyAccount.selectBankName(accountData.bankName);
      thirdPartyAccount.enterAccountNumber(randomAccountNumber);
      thirdPartyAccount.enterShortCode(`${Cypress._.random(1000)}`);
      thirdPartyAccount.enterbranchCode(`${Cypress._.random(1000)}`);

      // Click Next Button
      thirdPartyAccount.clickNextButton();

      // Capture personal info details
      thirdPartyAccount.enterFirstName(generateRandomData().firstName);
      thirdPartyAccount.enterLastName(generateRandomData().lastName);
      thirdPartyAccount.selectDateOfBirth(generateRandomData().dob);
      thirdPartyAccount.selectGender(accountData.gender);
      thirdPartyAccount.enterEmail(generateRandomData().email);
      thirdPartyAccount.selectContacttype('Mobile');
      thirdPartyAccount.enterPhoneNumber(generateRandomData().phoneNumber);
      thirdPartyAccount.selectCountryofOrigin(generateRandomData().country);
      thirdPartyAccount.selectRelationship('Client');
      thirdPartyAccount.enterDocNumber(`${Cypress._.random(10000000)}`);
      thirdPartyAccount.selectIssuedCountry(generateRandomData().country);
      thirdPartyAccount.uploadIndividualPassport(accountData.individualPassword);
      thirdPartyAccount.selectDocumentType();

      // Click Next Button
      thirdPartyAccount.clickNextButton();

      // Capture Address details
      thirdPartyAccount.selectAddrCountry(generateRandomData().country);
      thirdPartyAccount.enterState(generateRandomData().state);
      thirdPartyAccount.enterPostalCode(generateRandomData().postalCode);
      thirdPartyAccount.enterCity(generateRandomData().city);
      thirdPartyAccount.enterAddressLine1(generateRandomData().address);
      thirdPartyAccount.enterAddressLine2(generateRandomData().address);
      thirdPartyAccount.uploadAddressProof(accountData.addressProof);
      thirdPartyAccount.selectAddrDocumentType();

      // Click Next Button
      thirdPartyAccount.clickNextButton();

      // Click Submit Button in the review screen and get account id
      return thirdPartyAccount.clickThirdPartyIndiSubmitButton().then((response: { id: string }) => {
        // Validate the success message/status
        validateSnackBarMessage(SNACKBAR_MESSAGES.BANK_ACCOUNT_WHITELISTED);

        // Validate status label
        thirdPartyAccount.validateWhitelistStatus('Unverified');

        // Return the account number and ID as a Cypress-wrapped object
        return cy.wrap({ accountNumber: randomAccountNumber, id: response.id });
      });
    });
  });
}

export function createWhitelistThirdPartyInstitutionalAccount(
  whitelistPage: WhitelistPage,
  accountData: any,
): Cypress.Chainable<{ accountNumber: string; id: string }> {
  return cy.wrap(null).then(() => {
    // Select Accounttype, Ownership,
    whitelistPage.clickAddAccount();
    whitelistPage.selectAccount('Bank Account');
    whitelistPage.selectOwnership('Third Party Account');
    whitelistPage.selectClienttype('Business');
    whitelistPage.clickNextButton();

    const randomAccountNumber = `${Cypress._.random(10000000000)}`;

    return whitelistPage.openThirdPartyAccountPage().then(thirdPartyAccount => {
      // Fill in the Own Bank Account form -Bankname, AccountNumber, ShortCode, BranchCode
      thirdPartyAccount.selectBankName(accountData.bankName);
      thirdPartyAccount.enterAccountNumber(randomAccountNumber);
      thirdPartyAccount.enterShortCode(`${Cypress._.random(1000)}`);
      thirdPartyAccount.enterbranchCode(`${Cypress._.random(1000)}`);

      // Click Next Button
      thirdPartyAccount.clickNextButton();

      // Capture Company info details
      thirdPartyAccount.enterCompanyName(generateRandomData().companyName);
      thirdPartyAccount.selectRegistrationCountry(generateRandomData().country);
      thirdPartyAccount.selectRegistrationDate(generateRandomData().dob);
      thirdPartyAccount.enterRegistrationNumber(`${Cypress._.random(10000000)}`);
      thirdPartyAccount.enterBusinessEmail(generateRandomData().email);
      thirdPartyAccount.selectBusinessContacttype('Mobile');
      thirdPartyAccount.enterBusinessPhoneNumber(generateRandomData().phoneNumber);
      thirdPartyAccount.selectCounterPartyRelationship('Client');
      thirdPartyAccount.uploadCompanyRegistrationProof(accountData.companyRegistrationProof);
      thirdPartyAccount.selectRegistrationDocumentType();

      // Click Next Button
      thirdPartyAccount.clickNextButton();

      // Capture Address details
      thirdPartyAccount.selectAddrCountry(generateRandomData().country);
      thirdPartyAccount.enterState(generateRandomData().state);
      thirdPartyAccount.enterPostalCode(generateRandomData().postalCode);
      thirdPartyAccount.enterCity(generateRandomData().city);
      thirdPartyAccount.enterAddressLine1(generateRandomData().address);
      thirdPartyAccount.enterAddressLine2(generateRandomData().address);
      thirdPartyAccount.uploadAddressProof(accountData.addressProof);
      thirdPartyAccount.selectAddrDocumentType();

      // Click Next Button
      thirdPartyAccount.clickNextButton();

      // Click Submit Button in the review screen and get account id
      return thirdPartyAccount.clickThirdPartyInstSubmitButton().then((response: { id: string }) => {
        // Validate the success message/status
        validateSnackBarMessage(SNACKBAR_MESSAGES.BANK_ACCOUNT_WHITELISTED);

        // Validate status label
        thirdPartyAccount.validateWhitelistStatus('Unverified');

        // Return the account number and ID as a Cypress-wrapped object
        return cy.wrap({ accountNumber: randomAccountNumber, id: response.id });
      });
    });
  });
}
