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
    slotPage.clickCanvas();

    slotPage.winAnimationExists().then((exists) => {
      if (exists) {
        slotPage.getWinAnimation().should("be.visible");
      } else {
        cy.log("No win this time – win animation not shown.");
      }
    });
  });
});
