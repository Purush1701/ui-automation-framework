// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Ignore HttpErrorResponse 404 and 503 errors from dummy endpoint globally
Cypress.on('uncaught:exception', err => {
  if (
    err.message &&
    err.message.includes('HttpErrorResponse') &&
    (err.message.includes('503 Service Temporarily Unavailable') || err.message.includes('404 Not Found')) &&
    err.message.includes('/q')
  ) {
    return false;
  }
});

// <reference types="cypress" />

import './commands';
import './auth';
import './commands/api-commands';

Cypress.on('test:before:run', () => {
  Cypress.config('baseUrl', Cypress.env('cpurl'));
});

before(() => {
  cy.login(); // This will create the session if it doesn't exist
});

beforeEach(() => {
  cy.login(); // This will reuse the existing session or create a new one if it doesn't exist
  cy.visit('/');

  // Wait for the dashboard/asset-balances endpoint to return 200
  cy.intercept('GET', '**/dashboard/asset-balances').as('assetBalances');
  // After asset-balances is loaded, wait for the dashboard/recent-activities endpoint to return 200
  cy.intercept('GET', '**/recent-activities?_pageSize=10').as('recentActivities');

  cy.wait('@assetBalances').its('response.statusCode').should('eq', 200);
  cy.wait('@recentActivities').its('response.statusCode').should('eq', 200);
});
