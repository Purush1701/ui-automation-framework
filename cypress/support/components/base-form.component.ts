class BaseForm {
  constructor(private readonly path: string) {}

  visit() {
    cy.visit(this.path);
  }

  fillInput(selector: string, value: string) {
    cy.get(selector).type(value);
  }

  clickButton(selector: string) {
    cy.get(selector).click();
  }

  assertPageUrl(expectedUrl: string) {
    cy.url().should('include', expectedUrl);
  }

  waitForElement(selector: string) {
    cy.get(selector, { timeout: 10000 }).should('be.visible');
  }
}

export default BaseForm;
