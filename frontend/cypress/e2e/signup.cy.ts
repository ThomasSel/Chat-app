import { randomString } from "./utils";

describe("Signup", () => {
  let username: string, email: string, password: string;
  beforeEach(() => {
    cy.visit("/signup");

    username = randomString(8);
    email = `${randomString(8)}@test.com`;
    password = randomString(8);
  });

  it("redirects with new and valid credentials", () => {
    cy.get('[data-cy="signup-username"]').type(username);
    cy.get('[data-cy="signup-email"]').type(email);
    cy.get('[data-cy="signup-password"]').type(password);
    cy.get('[data-cy="signup-submit"]').click();

    cy.url().should("include", "/login");
  });

  describe("missing fields", () => {
    it("no redirect without username", () => {
      cy.get('[data-cy="signup-email"]').type(email);
      cy.get('[data-cy="signup-password"]').type(password);
      cy.get('[data-cy="signup-submit"]').click();

      cy.url().should("include", "/signup");
    });

    it("no redirect without email", () => {
      cy.get('[data-cy="signup-username"]').type(username);
      cy.get('[data-cy="signup-password"]').type(password);
      cy.get('[data-cy="signup-submit"]').click();

      cy.url().should("include", "/signup");
    });

    it("no redirect without password", () => {
      cy.get('[data-cy="signup-username"]').type(username);
      cy.get('[data-cy="signup-email"]').type(email);
      cy.get('[data-cy="signup-submit"]').click();

      cy.url().should("include", "/signup");
    });
  });

  it("fails with a duplicate email", () => {
    cy.get('[data-cy="signup-username"]').type(username);
    cy.get('[data-cy="signup-email"]').type(email);
    cy.get('[data-cy="signup-password"]').type(password);
    cy.get('[data-cy="signup-submit"]').click();

    cy.visit("/signup");

    cy.get('[data-cy="signup-username"]').type(username);
    cy.get('[data-cy="signup-email"]').type(email);
    cy.get('[data-cy="signup-password"]').type(password);
    cy.get('[data-cy="signup-submit"]').click();

    cy.url().should("include", "/signup");
  });

  it("link redirects to login page", () => {
    cy.get('[data-cy="login-link"]')
      .should("contain.text", "Already have an account")
      .click();
    cy.url().should("contain", "/login");
  });
});
