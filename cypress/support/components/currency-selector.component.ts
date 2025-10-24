class CurrencySelector {
  selectCurrency(currency: string) {
    cy.get('app-transfer-flow-asset-selection-item').find('.asset-currency-card').click();
    cy.get('.asset-currency-card.asset-currency-card--select-option').contains(currency).click();
  }
}

export default CurrencySelector;
