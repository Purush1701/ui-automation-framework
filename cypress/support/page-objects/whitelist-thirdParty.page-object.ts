import {
  clickButton,
  selectDropDownByText,
  enterInputValue,
  selectDateOfBirth,
  validateStatusLabel,
  uploadFile,
} from '../../support/utility/common-utility.ts';

class WhitelistThirdPartyAccountPage {
  //Third Party Account
  private getAddWhitelistElement() {
    return cy.get('app-add-account-selection');
  }

  private getPersonalinfoElement() {
    return cy.get('mat-expansion-panel:has(mat-expansion-panel-header:contains("Personal Info"))');
  }

  private getPersonalInfoFormFields() {
    return this.getPersonalinfoElement().find('form-field');
  }

  private getContactFormElement = () => {
    return this.getPersonalinfoElement().find('form-field-group');
  };

  private getContactFormFields() {
    return this.getPersonalinfoElement().find('form-field-group').find('form-field');
  }

  private getAddressinfoElement() {
    return cy.get('mat-expansion-panel:has(mat-expansion-panel-header:contains("Address"))');
  }
  private getAddressFormFields = () => {
    return this.getAddressinfoElement().find('address-form-group').find('form-field');
  };

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

  enterFirstName(firstName: string) {
    enterInputValue(this.getPersonalinfoElement, 0, firstName);
  }

  enterLastName(lastName: string) {
    enterInputValue(this.getPersonalinfoElement, 1, lastName);
  }

  selectDateOfBirth(date: string) {
    this.getPersonalInfoFormFields().eq(2).find('datepicker').click();
    selectDateOfBirth(date);
  }

  selectGender(gender: string) {
    selectDropDownByText(this.getPersonalinfoElement, 3, gender);
  }

  enterEmail(email: string) {
    enterInputValue(this.getPersonalinfoElement, 4, email);
  }

  selectContacttype(type: 'Mobile' | 'Home' | 'Office') {
    selectDropDownByText(this.getContactFormElement, 0, type);
  }

  enterPhoneNumber(phoneNumber: string) {
    enterInputValue(this.getContactFormElement, 1, phoneNumber);
  }

  selectCountryofOrigin(country: string) {
    selectDropDownByText(this.getPersonalinfoElement, 7, country);
  }

  selectRelationship(type: 'Client' | 'Parent' | 'Sibling' | 'Child' | 'Other') {
    this.getPersonalInfoFormFields().eq(8).find('dropdown').click();
    cy.get('.dropdown-menu__options')
      .find('option')
      .contains(type)
      .scrollIntoView()
      .should('be.visible')
      .click();
  }

  enterDocNumber(docNumber: string) {
    enterInputValue(this.getPersonalinfoElement, 9, docNumber);
  }

  selectIssuedCountry(country: string) {
    selectDropDownByText(this.getPersonalinfoElement, 10, country);
  }

  uploadIndividualPassport(fileName: string) {
    uploadFile(() => this.getPersonalInfoFormFields().eq(11), fileName);
  }

  selectDocumentType() {
    this.getPersonalInfoFormFields()
      .eq(11)
      .contains('button', 'Select document type')
      .scrollIntoView()
      .should('exist')
      .click({ force: true });
    cy.get('.dropdown-menu__options').find('option').first().click();
  }

  //Address

  selectAddrCountry(country: string) {
    this.getAddressinfoElement().should('be.visible');
    selectDropDownByText(this.getAddressinfoElement, 0, country);
  }

  enterState(state: string) {
    enterInputValue(this.getAddressinfoElement, 1, state);
  }

  enterPostalCode(code: string) {
    enterInputValue(this.getAddressinfoElement, 2, code);
  }

  enterCity(city: string) {
    enterInputValue(this.getAddressinfoElement, 3, city);
  }

  enterAddressLine1(address: string) {
    enterInputValue(this.getAddressinfoElement, 4, address);
  }

  enterAddressLine2(address: string) {
    enterInputValue(this.getAddressinfoElement, 5, address);
  }

  uploadAddressProof(fileName: string) {
    uploadFile(() => this.getAddressinfoElement(), fileName);
  }

  selectAddrDocumentType() {
    this.getAddressinfoElement()
      .contains('button', 'Select document type')
      .scrollIntoView()
      .should('exist')
      .click({ force: true });
    cy.get('.dropdown-menu__options').find('option').first().click();
  }

  clickNextButton() {
    clickButton('Next');
  }

  clickThirdPartyIndiSubmitButton() {
    // Setup intercepts
    cy.intercept('POST', '**/whitelist/third-party/individual').as('submitIndiAccount');
    // Click submit button
    clickButton('Submit');
    // Wait for requests and extract the data
    return cy.wait('@submitIndiAccount').then(interception => {
      expect(interception.response.statusCode).to.eq(200);
      const { accountId } = interception.response.body;
      return { id: accountId };
    });
  }

  // Third Party Business Account

  private getCompanyinfoElement() {
    return cy.get('mat-expansion-panel:has(mat-expansion-panel-header:contains("Company Info"))');
  }

  private getCompanyInfoFormFields() {
    return this.getCompanyinfoElement().find('form-field');
  }

  private getCompanyContactElement = () => {
    return this.getCompanyinfoElement().find('form-field-group');
  };

  private getCompanyContactFormFields = () => {
    return this.getCompanyContactElement().find('form-field');
  };

  private getCompanyAddressinfoElement() {
    return cy.get('mat-expansion-panel:has(mat-expansion-panel-header:contains("Address"))');
  }

  private getCompanyAddressFormFields() {
    return this.getCompanyAddressinfoElement().find('address-form-group').find('form-field');
  }

  enterCompanyName(cName: string) {
    enterInputValue(this.getCompanyinfoElement, 0, cName);
  }

  selectRegistrationCountry(country: string) {
    selectDropDownByText(this.getCompanyinfoElement, 1, country);
  }

  selectRegistrationDate(date: string) {
    this.getCompanyInfoFormFields().eq(2).find('datepicker').click();
    selectDateOfBirth(date);
  }

  enterRegistrationNumber(regNumber: string) {
    enterInputValue(this.getCompanyinfoElement, 3, regNumber);
  }

  enterBusinessEmail(bEmail: string) {
    enterInputValue(this.getCompanyinfoElement, 4, bEmail);
  }

  selectBusinessContacttype(type: 'Mobile' | 'Home' | 'Office') {
    selectDropDownByText(this.getCompanyContactElement, 0, type);
  }

  enterBusinessPhoneNumber(bPhone: string) {
    enterInputValue(this.getCompanyContactElement, 1, bPhone);
  }

  selectCounterPartyRelationship(type: 'Client' | 'Parent' | 'Sibling' | 'Child' | 'Other') {
    selectDropDownByText(this.getCompanyinfoElement, 7, type);
  }

  uploadCompanyRegistrationProof(fileName: string) {
    uploadFile(() => this.getCompanyinfoElement(), fileName);
  }

  selectRegistrationDocumentType() {
    this.getCompanyinfoElement()
      .contains('button', 'Select document type')
      .scrollIntoView()
      .should('exist')
      .click({ force: true });
    cy.get('.dropdown-menu__options').find('option').first().click();
  }

  clickThirdPartyInstSubmitButton() {
    // Setup intercepts
    cy.intercept('POST', '**/whitelist/third-party/institutional').as('submitInstitutional');
    // Click submit button
    clickButton('Submit');
    // Wait for requests and extract the data
    return cy.wait('@submitInstitutional').then(interception => {
      expect(interception.response.statusCode).to.eq(200);
      const { accountId } = interception.response.body;
      return { id: accountId };
    });
  }

  validateWhitelistStatus(status: string) {
    validateStatusLabel(status);
  }

  deleteWhitelistAccount() {
    cy.intercept('DELETE', '**/whitelist/third-party/**').as('deleteWhitelistAccount');
    cy.get('button icon[name="deleteBinLine"]').click();
    clickButton('Yes, proceed');
    cy.wait('@deleteWhitelistAccount').its('response.statusCode').should('eq', 204);
  }
}

export default WhitelistThirdPartyAccountPage;
