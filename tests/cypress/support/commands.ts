Cypress.Commands.add("spinSlot", () => {
  cy.get("canvas").click();
});

Cypress.Commands.add("assertWin", () => {
  cy.get("#win-indicator", { timeout: 8000 }).should("be.visible");
});

Cypress.Commands.add("spyConsole", () => {
  cy.window().then((win) => cy.spy(win.console, "log").as("consoleLog"));
});
