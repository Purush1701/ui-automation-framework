import TransferFormHandler from './transfer-form-handler.component.ts';

class StepperFormHandler {
  private rootSelector: string;
  private stepperSelector = 'app-stepper-group';

  constructor(rootSelector: string) {
    this.rootSelector = rootSelector;
  }

  getStepperGroup() {
    return cy.get(`${this.rootSelector} ${this.stepperSelector}`);
  }

  getExpansionPanels() {
    return this.getStepperGroup().find('mat-expansion-panel');
  }

  getExpansionPanel(index: number) {
    return this.getExpansionPanels().eq(index);
  }

  expandPanel(index: number) {
    this.getExpansionPanel(index).then($panel => {
      if (!$panel.hasClass('mat-expanded')) {
        cy.wrap($panel).click();
      }
    });
  }

  getFormFields(panelIndex: number) {
    return this.getExpansionPanel(panelIndex).find('form-field');
  }

  getTransferFormHandler(panelIndex: number) {
    return new TransferFormHandler(this.getFormFields(panelIndex));
  }
}

export default StepperFormHandler;
