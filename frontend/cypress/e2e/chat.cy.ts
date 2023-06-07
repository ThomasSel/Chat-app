import { createWebSocket, randomString } from "./utils";

describe("chat page", () => {
  let username: string, email: string, password: string;
  before(() => {
    username = randomString(8);
    email = `${randomString(8)}@test.com`;
    password = randomString(8);

    cy.signup(username, email, password);
  });

  it("redirects to login with no token", () => {
    cy.visit("/chats");

    cy.url().should("include", "/login");
  });

  it("doesn't redirect with a token", () => {
    cy.login(email, password);

    cy.url().should("include", "/chats");
  });

  it("receives messages it submits", () => {
    cy.login(email, password);

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
    let ws1: WebSocket, ws2: WebSocket;

    cy.login(email, password);
    cy.url()
      .should("include", "/chats")
      .then(async () => {
        [ws1, ws2] = await Promise.all([createWebSocket(), createWebSocket()]);

        const token = window.sessionStorage.getItem("token");
        ws1.send(JSON.stringify({ token: token }));
        ws2.send(JSON.stringify({ token: token }));
      });

    // Type in the box to slow the test down and give server time to
    //   authenticate ws1 and ws2
    cy.get('[data-cy="chat-input"]')
      .type(
        "Long message to slow cypress down and give the server time to authenticate ws1 and ws2"
      )
      .then(() => {
        ws1.send(JSON.stringify({ message: "message 1" }));
        ws2.send(JSON.stringify({ message: "message 2" }));

        ws1.close();
        ws2.close();
      })
      .then(() => {
        cy.get('[data-cy="chat-messages"]').should("contain.text", "message 1");
        cy.get('[data-cy="chat-messages"]').should("contain.text", "message 2");
      });
  });
});
