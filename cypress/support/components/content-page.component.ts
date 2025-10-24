class ContentPage {
  private contentSelector = 'mat-sidenav-content';

  getOverviewContent() {
    return cy.get(this.contentSelector).find('app-dashboard');
  }

  getAssetHoldingsContent() {
    return cy.get(this.contentSelector).find('app-asset-holdings');
  }

  getActivityContent() {
    return cy.get(this.contentSelector).find('app-activity');
  }

  getAssetTransferContent() {
    return cy.get(this.contentSelector).find('app-asset-transfer');
  }

  getOTCContent() {
    return cy.get(this.contentSelector).find('app-otc');
  }

  getWhitelistContent() {
    return cy.get(this.contentSelector).find('app-whitelist');
  }

  getHelpWidget() {
    return cy.get(this.contentSelector).find('app-help-widget');
  }

  getUrlMap() {
    return {
      Overview: '/dashboard',
      'Asset Holdings': '/asset-holdings',
      Activity: '/activity',
      'Asset Transfer': '/asset-transfer',
      OTC: '/otc',
      Whitelist: '/whitelist',
    };
  }
}

export default ContentPage;
