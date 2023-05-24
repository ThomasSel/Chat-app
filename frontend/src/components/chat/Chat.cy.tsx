import Chat from "./Chat";

describe("Chat", () => {
  it("displays the name of the chat", () => {
    cy.mount(<Chat name="Test" messages={[]} />);

    cy.get('[data-cy="chat-name"]').should("contain", "Test");
  });

  it("when messages are empty, displays nothing", () => {
    cy.mount(<Chat name="Test" messages={[]} />);

    cy.get('[data-cy="chat-messages"]').should("not.contain.text");
  });

  it("displays all messages given as props", () => {
    cy.mount(<Chat name="Test" messages={["message 1", "message 2"]} />);

    cy.get('[data-cy="chat-messages"]').should(
      "contain.html",
      "<li>message 1</li>"
    );
    cy.get('[data-cy="chat-messages"]').should(
      "contain.html",
      "<li>message 2</li>"
    );
  });

  it("has an input box and a submit button", () => {
    cy.mount(<Chat name="Test" messages={[]} />);

    cy.get('[data-cy="chat-input"]').should("be.visible");
    cy.get('[data-cy="chat-submit"]').should("be.visible");
  });
});
