const SELECTORS = {
  canvas: "canvas",
  winIndicator: "#win-indicator",
};

export class SlotPage {
  getCanvas() {
    return cy.get(SELECTORS.canvas);
  }

  clickCanvas() {
    this.getCanvas().click();
  }

  getWinIndicator() {
    return cy.get(SELECTORS.winIndicator);
  }

  spyOnConsoleLog() {
    return cy.window().then((win) => cy.spy(win.console, "log").as("consoleLog"));
  }
}
