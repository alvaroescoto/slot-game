declare namespace Cypress {
  interface Chainable {
    spinSlot(): Chainable<void>;
    assertWin(): Chainable<void>;
    spyConsole(): Chainable<void>;
  }
}
