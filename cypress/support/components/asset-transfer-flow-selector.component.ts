class AssetTransferFlowSelector {
  private rootSelector = 'app-select-asset-transfer-flow';
  selectFlow(flow: 'Transfer In' | 'Transfer Out' | 'RSN' | 'Third Party Transfer') {
    const flowIndex: Record<string, number> = {
      'Transfer In': 0,
      'Transfer Out': 1,
      // prettier-ignore
      'RSN': 2,
      'Third Party Transfer': 3,
    };

    // Target specifically the instruction section (second toggle group)
    cy.get(`${this.rootSelector} .select-flow__instruction app-toggle-item-container`).eq(flowIndex[flow]).click();
  }

  waitForCreateInstructionEnabled() {
    cy.get(`${this.rootSelector} button`).contains('Create instruction').should('be.enabled');
  }

  clickCreateInstruction() {
    cy.get(`${this.rootSelector} button`).contains('Create instruction').click();
  }
}

export default AssetTransferFlowSelector;
