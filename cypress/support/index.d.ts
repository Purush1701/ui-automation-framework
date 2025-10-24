/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getLoginPage(): Chainable<import('./page-objects/login-page.page-object').default>;
    login(): Chainable<void>;
  }

  interface Cypress {
    env(key: 'context'): 'staging' | 'uat';
  }
}
