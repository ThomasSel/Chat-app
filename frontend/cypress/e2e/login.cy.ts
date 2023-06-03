import { randomString } from "./utils";

describe("Login", () => {
  let username: string, email: string, password: string;
  before(() => {
    username = randomString(8);
    email = `${randomString(8)}@test.com`;
    password = randomString(8);

    cy.signup(username, email, password);
  });

  beforeEach(() => {
    cy.visit("/login");
  });

  it("redirects with valid credentials", () => {
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("include", "/chats");
  });

  it("doesn't redirect with invalid email", () => {
    cy.get('[data-cy="login-email"]').type(`${randomString(8)}@test.com`);
    cy.get('[data-cy="login-password"]').type(password);
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("not.include", "/chats");
  });

  it("doesn't redirect with invalid password", () => {
    cy.get('[data-cy="login-email"]').type(email);
    cy.get('[data-cy="login-password"]').type(`${randomString(8)}`);
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("not.include", "/chats");
  });

  describe("missing fields", () => {
    it("no redirect without email", () => {
      cy.get('[data-cy="login-password"]').type(password);
      cy.get('[data-cy="login-submit"]').click();

      cy.url().should("not.include", "/chats");
    });

    it("no redirect without password", () => {
      cy.get('[data-cy="login-email"]').type(email);
      cy.get('[data-cy="login-submit"]').click();

      cy.url().should("not.include", "/chats");
    });
  });
});
