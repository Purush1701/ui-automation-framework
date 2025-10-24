import ClientServiceSwitcherModal from './client-service-switcher-modal.component.ts';

type NavItem = { name: string; url: string };

class SidebarNavigation {
  private infoItems: NavItem[];
  private mainItems: NavItem[];
  private footerItems: NavItem[];
  private sidebarSelector = '[data-testid="sidebar"]';
  private menuItemSelector = '[data-testid="sidebar-menu-item"]';

  constructor() {
    this.infoItems = [
      { name: 'Client Service Switcher', url: '' },
      { name: 'Users and Client Info', url: '/client/authorized-users' },
    ];
    this.mainItems = [
      { name: 'Overview', url: '/dashboard' },
      { name: 'Asset Holdings', url: '/asset-holdings' },
      { name: 'Activity', url: '/activity' },
      { name: 'Cards', url: '/card' },
      { name: 'Asset Transfer', url: '/asset-transfer' },
      { name: 'OTC', url: '/otc' },
    ];
    this.footerItems = [{ name: 'Whitelist', url: '/whitelist' }];
  }

  private getNavbar() {
    return cy.get('mat-sidenav');
  }

  private getMainNav() {
    return this.getNavbar().find('.sidebar__nav');
  }

  private getFooterNav() {
    return this.getNavbar().find('.sidebar__footer');
  }

  private getNavLinks(navSection: 'main' | 'footer' | 'info') {
    switch (navSection) {
      case 'main':
        return this.getMainNav().find('a');
      case 'footer':
        return this.getFooterNav().find('a');
      case 'info':
        return this.getMainNav().find('.sidebar__info').children();
      default:
        throw new Error(`Invalid nav section: ${navSection}`);
    }
  }

  getInfoItems() {
    return this.infoItems;
  }

  getMainItems() {
    return this.mainItems;
  }

  getFooterItems() {
    return this.footerItems;
  }

  navigateTo(section: 'info' | 'main' | 'footer', index: number) {
    this.getNavLinks(section).eq(index).click();
    if (section === 'info' && index === 0) {
      return new ClientServiceSwitcherModal();
    }
  }

  getExpectedUrl(section: 'info' | 'main' | 'footer', index: number) {
    switch (section) {
      case 'info':
        return this.infoItems[index].url;
      case 'main':
        return this.mainItems[index].url;
      case 'footer':
        return this.footerItems[index].url;
    }
  }

  navigateToByName(menuItemName: string) {
    this.waitForSidebarReady();
    this.getMainNav().contains('a', menuItemName).click();
  }

  waitForSidebarReady() {
    // Wait for the sidebar to be visible
    this.getNavbar().should('be.visible');

    // Wait for main navigation items to be present
    this.getMainNav().find('a').should('have.length.gt', 0);

    // Wait for the 'Asset Transfer' link to be visible
    this.getMainNav().contains('a', 'Asset Transfer').should('be.visible');
  }
}

export default SidebarNavigation;
