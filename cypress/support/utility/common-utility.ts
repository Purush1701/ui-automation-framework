export function clickButton(buttonText: string) {
  cy.contains('button', buttonText, { timeout: 10000 }).scrollIntoView().should('be.enabled').click({ force: true });
}

export function validateSnackBarMessage(message: string) {
  // Target the app-snack-bar component directly based on the actual DOM structure
  cy.get('app-snack-bar span.snack-bar__message', { timeout: 20000 })
    .should('be.visible')
    .and('contain.text', message);
}

export function validateStatusLabel(status: string) {
  cy.get('.status-label__label')
    .should('be.visible', { timeout: 10000 })
    .invoke('text')
    .then(res => {
      expect(res).to.equal(status);
    });
}

export function selectDropdownOption(dropdownElement: Cypress.Chainable<JQuery<HTMLElement>>, optionIndex: number = 0) {
  dropdownElement.find('.dropdown__trigger-button__icon').click();
  cy.get('.dropdown-menu__options').find('option').eq(optionIndex).click();
}

export const ENV_CONTEXT = Cypress.env('context');

export function selectDropDownByText(getElement: () => Cypress.Chainable, formFieldIndex: number, value: string) {
  const formField = getFormFields(getElement).eq(formFieldIndex);

  // Open the dropdown
  formField.then($field => {
    if ($field.find('.dropdown__trigger-button__icon').length > 0) {
      cy.wrap($field).find('.dropdown__trigger-button__icon').click();
    } else if ($field.find('dropdown').length > 0) {
      cy.wrap($field).find('dropdown').click();
    } else {
      throw new Error('Neither dropdown trigger button nor dropdown found');
    }
  });

  //Type if search is available
  cy.get('body').then($body => {
    if ($body.find('.dropdown-menu__search__input').length > 0) {
      cy.get('.dropdown-menu__search__input').should('be.visible').type(value);
    }
  });
  // select dropdown by text
  cy.get('.dropdown-menu__options')
    .find('option')
    .contains(value)
    .scrollIntoView()
    .should('be.visible')
    .click({ force: true });
}

export function verifyDropdownValueNotPresent(
  getElement: () => Cypress.Chainable,
  formFieldIndex: number,
  value: string,
) {
  const formField = getFormFields(getElement).eq(formFieldIndex);

  // Open the dropdown
  formField.then($field => {
    if ($field.find('.dropdown__trigger-button__icon').length > 0) {
      cy.wrap($field).find('.dropdown__trigger-button__icon').click();
    } else if ($field.find('dropdown').length > 0) {
      cy.wrap($field).find('dropdown').click();
    } else {
      throw new Error('Neither dropdown trigger button nor dropdown found');
    }
  });

  // Check if search is available and verify "0 results" message
  cy.get('body').then($body => {
    const searchInput = $body.find('.dropdown-menu__search__input');
    if (searchInput.length) {
      cy.get('.dropdown-menu__search__input').should('be.visible').type(value);
      cy.contains('span', '0 results').should('be.visible');
    }
  });

  // Verify dropdown option is not present
  cy.get('.dropdown-menu__options').find('option').contains(value).should('not.exist');
}

export function selectDateOfBirth(date: string) {
  const [year, month, day] = date.split('-');
  const monthMap: { [key: string]: string } = {
    '01': 'JAN',
    '02': 'FEB',
    '03': 'MAR',
    '04': 'APR',
    '05': 'MAY',
    '06': 'JUN',
    '07': 'JUL',
    '08': 'AUG',
    '09': 'SEP',
    '10': 'OCT',
    '11': 'NOV',
    '12': 'DEC',
  };

  // Click the calendar header to open year selection
  cy.get('.mat-calendar-period-button').click();

  // Navigate to correct year range
  selectYear(year);

  // Select the correct month using its text representation
  cy.contains('.mat-calendar-body-cell-content', monthMap[month]).should('be.visible').click();

  // Select the correct day
  cy.contains('.mat-calendar-body-cell-content', parseInt(day, 10)).should('be.visible').click();
}

function selectYear(year: string) {
  cy.get('.mat-calendar-body').then($calendar => {
    if (!$calendar.text().includes(year.toString())) {
      if (parseInt(year) < 2016) {
        cy.get('.mat-calendar-previous-button').click();
      } else {
        cy.get('.mat-calendar-next-button').click();
      }
      // Wait for calendar update & retry
      cy.wait(500); // Optional, helps with stability
      selectYear(year); // Recursively call until the year is found
    } else {
      // Year is found, now click on it
      cy.get('.mat-calendar-body-cell').should('be.visible');
      cy.contains('.mat-calendar-body-cell-content', year.toString()).click();
    }
  });
}

export function getFormFields(getElement: () => Cypress.Chainable) {
  return getElement().find('form-field');
}

export function selectFirstDropdown(getElement: () => Cypress.Chainable, formFieldIndex: number) {
  getFormFields(getElement).eq(formFieldIndex).find('.dropdown__trigger-button__icon').click();
  cy.get('.dropdown-menu__options').find('option').first().click();
}

export function enterInputValue(getElement: () => Cypress.Chainable, formFieldIndex: number, value: string) {
  getFormFields(getElement).eq(formFieldIndex).find('input').type(value);
}

export const uploadFile = (
  getElement: () => Cypress.Chainable,
  fileName: string,
  inputSelector: string = 'input.file-uploader__input',
) => {
  const filePath = `cypress/fixtures/images/${fileName}`;
  cy.intercept('POST', '**/file-storage/upload-temp').as('fileUpload');
  getElement().find(inputSelector).selectFile(filePath, { action: 'drag-drop', force: true });
  cy.wait('@fileUpload', { timeout: 10000 }).its('response.statusCode').should('eq', 200);
};

export enum STATUS_CODES {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}
