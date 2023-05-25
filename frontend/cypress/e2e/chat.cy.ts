describe("chat page", () => {
  before(() => {
    cy.signup("fakeUsername", "test@test.com", "1234Password1234");
  });

  it("redirects to login with no token", () => {
    cy.visit("/chats");

    cy.url().should("include", "/login");
  });

  it("doesn't redirect with a token", () => {
    cy.login("test@test.com", "1234Password1234");

    cy.visit("/chats");

    cy.url().should("include", "/chats");
  });
});
