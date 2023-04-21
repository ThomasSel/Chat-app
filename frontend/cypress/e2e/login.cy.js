import randomString from "./utils";

describe("Login", () => {
  before(() => {
    cy.signup("fakeUsername", "test@test.com", "1234Password1234");
  });

  beforeEach(() => {
    cy.visit("/login");
  });

  it("redirects with valid credentials", () => {
    cy.get('[data-cy="login-email"]').type("test@test.com");
    cy.get('[data-cy="login-password"]').type("1234Password1234");
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("include", "/chats");
  });

  it("doesn't redirect with invalid email", () => {
    cy.get('[data-cy="login-email"]').type(`${randomString(8)}@test.com`);
    cy.get('[data-cy="login-password"]').type("1234Password1234");
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("not.include", "/chats");
  });

  it("doesn't redirect with invalid password", () => {
    cy.get('[data-cy="login-email"]').type(`test@test.com`);
    cy.get('[data-cy="login-password"]').type(`${randomString(8)}`);
    cy.get('[data-cy="login-submit"]').click();

    cy.url().should("not.include", "/chats");
  });

  describe("missing fields", () => {
    it("no redirect without email", () => {
      cy.get('[data-cy="login-password"]').type("1234Password1234");
      cy.get('[data-cy="login-submit"]').click();

      cy.url().should("not.include", "/chats");
    });

    it("no redirect without password", () => {
      cy.get('[data-cy="login-email"]').type("test@test.com");
      cy.get('[data-cy="login-submit"]').click();

      cy.url().should("not.include", "/chats");
    });
  });
});
