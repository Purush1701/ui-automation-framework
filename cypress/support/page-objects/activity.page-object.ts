import { clickButton, validateSnackBarMessage, validateStatusLabel } from '../../support/utility/common-utility.ts';
import SidebarNavigation from '../components/sidebar-navigation.component.ts';
import { SNACKBAR_MESSAGES } from '../../support/constants/messages.ts';

class ActivityPage {
  private sidebar: SidebarNavigation;
  constructor() {
    this.sidebar = new SidebarNavigation();
  }

  private getActivityPageElement() {
    return cy.get('app-activity');
  }

  navigateToActivityPage() {
    this.sidebar.navigateToByName('Activity');
    this.waitForPageLoad();
  }

  waitForPageLoad() {
    this.getActivityPageElement().should('be.visible');
  }

  clickCancelButton() {
    clickButton('Cancel');
  }

  clickConfirmCancelButton() {
    clickButton('Yes, proceed');
  }

  validateInstructionCreateSuccessMsg() {
    validateSnackBarMessage(SNACKBAR_MESSAGES.INSTRUCTION_INITIATED);
  }

  validateInstructionCancelSuccessMsg() {
    validateSnackBarMessage(SNACKBAR_MESSAGES.INSTRUCTION_CANCELLED);
  }

  validateInstructionCancelFailMsg() {
    validateSnackBarMessage(SNACKBAR_MESSAGES.INSTRUCTION_CANCEL_FAILED);
  }

  validateInstructionStatus(status: string) {
    validateStatusLabel(status);
  }
}

export default ActivityPage;
