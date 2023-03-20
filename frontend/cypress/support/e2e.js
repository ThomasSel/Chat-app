// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import { VERIFY_TEST_RUNNER_TIMEOUT_MS } from "cypress/lib/tasks/verify";
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add("signup", (username, email, password) => {
  cy.visit("/signup");

  cy.get('[data-cy="signup-username"]').type(username);
  cy.get('[data-cy="signup-email"]').type(email);
  cy.get('[data-cy="signup-password"]').type(password);
  cy.get('[data-cy="signup-submit"]').click();
});
