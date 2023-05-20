import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      signup(username: string, email: string, password: string): Chainable<any>;
    }
  }
}

Cypress.Commands.add(
  "signup",
  (username: string, email: string, password: string) => {
    cy.visit("/signup");

    cy.get('[data-cy="signup-username"]').type(username);
    cy.get('[data-cy="signup-email"]').type(email);
    cy.get('[data-cy="signup-password"]').type(password);
    cy.get('[data-cy="signup-submit"]').click();
  }
);
