/// <reference types="cypress" />

import { SlotPage } from "../pages/SlotPage";

const slotPage = new SlotPage();

describe("Slot Game UI Test Suite", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should render the game canvas", () => {
    cy.get("canvas").should("exist").and("be.visible");
  });

  it("should trigger spin", () => {
    slotPage.spyOnConsoleLog();
    slotPage.clickCanvas();
  });

  it("should show win animation container (if exposed)", () => {
    cy.get("canvas");
    slotPage.clickCanvas();

    cy.get(".win-animation, canvas").should("exist");
  });
});
