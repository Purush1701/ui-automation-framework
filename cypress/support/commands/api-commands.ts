/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      generate_api_token_bo(): Chainable<string>;
      api_request(data: any): Chainable<any>;
      verifyStatusCode(expectedStatusCode: number): Chainable<any>;
    }
  }
}

/**
 * Generates an access token for Back Office API
 */
Cypress.Commands.add('generate_api_token_bo', () => {
  const options = {
    method: 'POST',
    url: Cypress.env('botoken'),
    form: true,
    body: {
      grant_type: 'password',
      scope: Cypress.env('boapi_scope'),
      client_id: Cypress.env('boapi_clientId'),
      client_secret: Cypress.env('boapi_clientSecret'),
      username: Cypress.env('boapi_username'),
      password: Cypress.env('boapi_password'),
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return cy.request(options).then(response => response.body['access_token']);
});

/**
 * Makes an API request with the provided configuration
 */
Cypress.Commands.add('api_request', data => {
  const { requestHeader, requestApiMethod, requestApiUrl, requestQS, requestBody = {} } = data;
  const headers = { ...(requestHeader || {}) };

  /*   // Log request details
  cy.log('API Request Details:')
  cy.log('Method:', requestApiMethod)
  cy.log('URL:', requestApiUrl)
  cy.log('Headers:', JSON.stringify(headers, null, 2))
  cy.log('Query String:', JSON.stringify(requestQS, null, 2))
  cy.log('Request Body:', JSON.stringify(requestBody, null, 2)) */

  const fullUrl = `${Cypress.env('boapi')}${requestApiUrl}`;
  const authHeader = { Authorization: `Bearer ${Cypress.env('authToken')}` };

  return cy
    .request({
      method: requestApiMethod,
      url: fullUrl,
      headers: { ...headers, ...authHeader },
      qs: requestQS,
      body: requestBody,
      failOnStatusCode: false,
    })
    .then(response => {
      /*     // Log response details
      cy.log('API Response Details:')
      cy.log('Status Code:', response.status)
      cy.log('Response Headers:', JSON.stringify(response.headers, null, 2))
      cy.log('Response Body:', JSON.stringify(response.body, null, 2)) */

      // Return the response in a new cy.then() to properly chain the commands
      return cy.then(() => response);
    });
});

/**
 * Verifies the status code of an API response
 */
Cypress.Commands.add('verifyStatusCode', { prevSubject: true }, (response, expectedStatusCode) => {
  const { status, body } = response;
  const errorMessage =
    status !== expectedStatusCode ? body.detail || JSON.stringify(body.errors) || body.title : undefined;
  expect(status, errorMessage).to.equal(expectedStatusCode);
  return response;
});
