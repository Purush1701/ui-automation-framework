import { defineConfig } from 'cypress';

describe('Sample Asset Transfer Tests', () => {
  beforeEach(() => {
    // Setup test data
    cy.fixture('ClientPortal/AssetTransfer/sample-transfer.json').as('transferData');
    
    // Perform authentication
    cy.login();
  });

  it('should navigate to asset transfer page', () => {
    cy.get('@transferData').then((data) => {
      // Navigate to asset transfer page
      cy.visit('/asset-transfer');
      
      // Wait for page to load
      cy.get('app-select-asset-transfer-flow', { timeout: 10000 }).should('be.visible');
      
      // Verify page elements are present
      cy.get('toggle-group').should('be.visible');
      cy.get('button:has-text("Create instruction")').should('be.visible');
      
      cy.log('Asset transfer page loaded successfully');
    });
  });

  it('should select transfer-in option', () => {
    cy.get('@transferData').then((data) => {
      // Navigate to asset transfer page
      cy.visit('/asset-transfer');
      
      // Wait for page to load
      cy.get('app-select-asset-transfer-flow', { timeout: 10000 }).should('be.visible');
      
      // Select transfer-in option
      cy.get('toggle-group button:has-text("Transfer-In")').click();
      
      // Verify selection
      cy.get('toggle-group button:has-text("Transfer-In")').should('have.class', 'active');
      
      cy.log('Transfer-In option selected successfully');
    });
  });

  it('should validate transfer form fields', () => {
    cy.get('@transferData').then((data) => {
      // Navigate to asset transfer page
      cy.visit('/asset-transfer');
      
      // Wait for page to load
      cy.get('app-select-asset-transfer-flow', { timeout: 10000 }).should('be.visible');
      
      // Select transfer-in option
      cy.get('toggle-group button:has-text("Transfer-In")').click();
      
      // Click create instruction button
      cy.get('button:has-text("Create instruction")').click();
      
      // Wait for form to load
      cy.get('form.asset-transfer-form', { timeout: 20000 }).should('be.visible');
      
      // Validate form fields are present
      cy.get('input[name="amount"]').should('be.visible');
      cy.get('select[name="fromBankAccount"]').should('be.visible');
      cy.get('select[name="toAccount"]').should('be.visible');
      cy.get('select[name="sourceOfFunds"]').should('be.visible');
      
      cy.log('Transfer form fields validated successfully');
    });
  });

  it('should fill transfer form with sample data', () => {
    cy.get('@transferData').then((data) => {
      // Navigate to asset transfer page
      cy.visit('/asset-transfer');
      
      // Wait for page to load
      cy.get('app-select-asset-transfer-flow', { timeout: 10000 }).should('be.visible');
      
      // Select transfer-in option
      cy.get('toggle-group button:has-text("Transfer-In")').click();
      
      // Click create instruction button
      cy.get('button:has-text("Create instruction")').click();
      
      // Wait for form to load
      cy.get('form.asset-transfer-form', { timeout: 20000 }).should('be.visible');
      
      // Fill form with sample data
      cy.get('input[name="amount"]').type(data.sampleTransfer.amount);
      cy.get('select[name="fromBankAccount"]').select(data.sampleTransfer.fromAccount_Id);
      cy.get('select[name="toAccount"]').select(data.sampleTransfer.toAccount_Id);
      cy.get('select[name="sourceOfFunds"]').select('salary');
      
      // Verify form is filled
      cy.get('input[name="amount"]').should('have.value', data.sampleTransfer.amount);
      
      cy.log('Transfer form filled with sample data successfully');
    });
  });
});
