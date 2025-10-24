/// <reference types="cypress" />
import LoginPage from './page-objects/login-page.page-object.ts';
import SidebarNavigation from './components/sidebar-navigation.component.ts';

declare global {
  namespace Cypress {
    interface Chainable {
      getLoginPage(): Chainable<LoginPage>;
      login(): Chainable<void>;
      getSidebar(): Chainable<SidebarNavigation>;
    }
  }
}

Cypress.Commands.add('getLoginPage', () => {
  return cy.wrap(new LoginPage(Cypress.env('cpurl')));
});

// The login command is now defined in auth.ts

Cypress.Commands.add('getSidebar', () => {
  return cy.wrap(new SidebarNavigation());
});
