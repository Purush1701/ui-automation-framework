class ClientServiceSwitcherModal {
  private modalSelector = 'app-full-size-modal-wrapper';

  constructor() {
    // Ensure the modal is visible when this object is created
    cy.get(this.modalSelector).should('exist');
  }

  private getModalHeader() {
    return cy.get(this.modalSelector).find('.full-size-modal-wrapper__header');
  }

  closeModal(action: 'home' | 'close' = 'close') {
    // Intercept the GET request to recent-activities
    cy.intercept('GET', '**/dashboard/recent-activities?_pageSize=10').as('recentActivities');

    if (action === 'home') {
      this.getModalHeader().find('button').first().click({ force: true });
    } else {
      this.getModalHeader().find('button').last().click({ force: true });
    }
  }

  // Add more methods here as needed for interacting with the modal content
}

export default ClientServiceSwitcherModal;
