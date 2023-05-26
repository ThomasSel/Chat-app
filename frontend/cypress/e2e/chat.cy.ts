import { createWebSocket } from "./utils";

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

  it("receives messages it submits", () => {
    cy.login("test@test.com", "1234Password1234");
    cy.visit("/chats");

    cy.get('[data-cy="chat-input"]').type("message 1");
    cy.get('[data-cy="chat-submit"]').click();
    cy.get('[data-cy="chat-input"]').should("not.contain.text", "message 1");

    cy.get('[data-cy="chat-input"]').type("message 2");
    cy.get('[data-cy="chat-submit"]').click();
    cy.get('[data-cy="chat-input"]').should("not.contain.text", "message 2");

    cy.get('[data-cy="chat-messages"]').should("contain.text", "message 1");
    cy.get('[data-cy="chat-messages"]').should("contain.text", "message 2");
  });

  it("receives and displays messages from other users", () => {
    cy.login("test@test.com", "1234Password1234");
    cy.visit("/chats").then(async () => {
      const [ws1, ws2] = await Promise.all([
        createWebSocket(),
        createWebSocket(),
      ]);

      ws1.send("message 1");
      ws2.send("message 2");

      ws1.close();
      ws2.close();
    });

    cy.get('[data-cy="chat-messages"]').should("contain.text", "message 1");
    cy.get('[data-cy="chat-messages"]').should("contain.text", "message 2");
  });
});
