import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:9000",
    specPattern: "tests/cypress/e2e/**/*.cy.{js,ts}",
    supportFile: "tests/cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      
    },
  },
  viewportWidth: 1920,     
  viewportHeight: 1080,     
});

