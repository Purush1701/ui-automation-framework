import LoginPage from './page-objects/login-page.page-object.ts';

const loginPage = new LoginPage(Cypress.env('cpurl') || '/', Cypress.env('cpauthurl'));

Cypress.Commands.add('login', () => {
  const context = Cypress.env('context');

  const username = Cypress.env('username');
  const password = Cypress.env('password');
  const mfaSecret = Cypress.env('mfaSecret');

  const sessionName = `userSession-${context}`;

  cy.session(
    sessionName,
    () => {
      loginPage.performFullLogin(username, password, mfaSecret);
    },
    {
      validate() {
        cy.visit('/');
        cy.url().should('include', '/dashboard', { timeout: 10000 });
      },
    },
  );
});
