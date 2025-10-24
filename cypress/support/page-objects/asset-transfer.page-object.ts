import SidebarNavigation from '../components/sidebar-navigation.component.ts';
import AssetTransferFlowSelector from '../components/asset-transfer-flow-selector.component.ts';
import CurrencySelector from '../components/currency-selector.component.ts';
import ClientServiceSwitcherModal from '../components/client-service-switcher-modal.component.ts';
import {
  clickButton,
  selectDropDownByText,
  getFormFields,
  selectFirstDropdown,
  enterInputValue,
} from '../../support/utility/common-utility.ts';
import TransferoutPage from './transfer-out.page-object.ts';
import TransferInPage from './transfer-in.page-objects.ts';
import ThirdPartyTransferPage from './third-party-transfer.page-object.ts';
import RSNTransferPage from './rsn-transfer.page-object.ts';

class AssetTransferPage {
  private sidebar: SidebarNavigation;
  private flowSelector: AssetTransferFlowSelector;
  private currencySelector: CurrencySelector;

  constructor() {
    this.sidebar = new SidebarNavigation();
    this.flowSelector = new AssetTransferFlowSelector();
    this.currencySelector = new CurrencySelector();
    this.navigateViaMenu();
  }

  private navigateViaMenu() {
    this.sidebar.navigateToByName('Asset Transfer');
    this.waitForPageLoad();
  }

  waitForPageLoad() {
    cy.get('app-asset-transfer', { timeout: 10000 }).should('be.visible');
    cy.get('app-select-asset-transfer-flow', { timeout: 10000 }).should('be.visible');
  }

  selectFlow(flow: 'Transfer In' | 'Transfer Out' | 'RSN' | 'Third Party Transfer') {
    this.waitForPageLoad();
    this.flowSelector.selectFlow(flow);
  }

  selectCurrency(currency: string) {
    this.waitForPageLoad();
    this.currencySelector.selectCurrency(currency);
  }

  clickCreateInstruction() {
    clickButton('Create instruction');
  }

  CloseCreateInstructionModel() {
    const dashboard = new ClientServiceSwitcherModal();
    dashboard.closeModal('close');
    clickButton('Yes, proceed');
  }

  clickNextButton() {
    clickButton('Next');
  }

  clickSubmitButton() {
    clickButton('Submit');
  }

  openTransferoutPage() {
    return new TransferoutPage();
  }

  openTransferInPage() {
    return new TransferInPage();
  }

  openThirdPartyTransferPage() {
    return new ThirdPartyTransferPage();
  }

  openRSNTransferPage() {
    return new RSNTransferPage();
  }
}

export default AssetTransferPage;
