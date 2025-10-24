import { authenticator } from 'otplib';

class LoginPage {
  private baseUrl: string;
  private authUrl: string;

  constructor(baseUrl: string = '/', authUrl: string = Cypress.env('cpauthurl')) {
    this.baseUrl = baseUrl;
    this.authUrl = authUrl;
  }

  visit() {
    cy.visit(this.baseUrl);
  }

  login(username: string, password: string) {
    this.visit();
    this.enterCredentials(username, password);
  }

  private enterCredentials(username: string, password: string) {
    cy.origin(
      this.authUrl,
      { args: { username, password, authUrl: this.authUrl } },
      ({ username, password, authUrl }) => {
        cy.get('#signInName').type(username);
        cy.get('#password').type(password);
        cy.get('button[type="submit"]').click();
      },
    );
  }

  enterOTP(secret: string) {
    const mfaCode = this.generateMFACode(secret);
    cy.origin(this.authUrl, { args: { mfaCode, authUrl: this.authUrl } }, ({ mfaCode, authUrl }) => {
      cy.get('#otpCode', { timeout: 10000 }).should('be.visible').type(mfaCode);
      cy.get('#continue').click();
    });
  }

  private generateMFACode(secret: string): string {
    if (!secret) {
      throw new Error('OTP secret is required for MFA code generation');
    }
    try {
      return authenticator.generate(secret.trim());
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new Error(`Failed to generate MFA code: ${errorMessage}`);
    }
  }

  assertOTPPageVisible() {
    cy.origin(this.authUrl, { args: { authUrl: this.authUrl } }, ({ authUrl }) => {
      cy.get('#otpCode', { timeout: 10000 }).should('be.visible');
    });
  }

  waitForLoginSuccess() {
    cy.intercept('GET', '**/environment.json').as('envConfig');
    cy.wait('@envConfig').its('response.statusCode').should('eq', 200);
    cy.url().should('include', '/dashboard');

    cy.get('[apptrackevent="Back to portal clicked"]').should('be.visible');
  }

  private handleModal(buttonText: string) {
    cy.contains('button', buttonText, { timeout: 20000 }).should('be.visible').click();
  }

  performFullLogin(username: string, password: string, otpSecret: string) {
    this.login(username, password);
    this.assertOTPPageVisible();
    this.enterOTP(otpSecret);
    this.waitForLoginSuccess();
  }
}

export default LoginPage;
