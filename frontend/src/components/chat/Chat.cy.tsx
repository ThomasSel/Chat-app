import Chat from "./Chat";

describe("Chat", () => {
  let socketMock: any;
  beforeEach(() => {
    socketMock = { send: (data: string): void => {} };
  });
  it("displays the name of the chat", () => {
    cy.mount(<Chat name="Test" messages={[]} socket={socketMock} />);

    cy.get('[data-cy="chat-name"]').should("contain", "Test");
  });

  it("when messages are empty, displays nothing", () => {
    cy.mount(<Chat name="Test" messages={[]} socket={socketMock} />);

    cy.get('[data-cy="chat-messages"]').should("not.contain.text");
  });

  it("displays all messages given as props", () => {
    cy.mount(
      <Chat
        name="Test"
        messages={["message 1", "message 2"]}
        socket={socketMock}
      />
    );

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
    cy.spy(socketMock, "send").as("socketMock");

    cy.mount(<Chat name="Test" messages={[]} socket={socketMock} />);

    cy.get('[data-cy="chat-input"]').type("testMessage");
    cy.get('[data-cy="chat-submit"]').click();

    cy.get("@socketMock").should("be.calledWith", "testMessage");
  });

  it("sets the message input blank after sumbitting", () => {
    cy.mount(<Chat name="Test" messages={[]} socket={socketMock} />);

    cy.get('[data-cy="chat-input"]').type("testMessage");
    cy.get('[data-cy="chat-submit"]').click();

    cy.get('[data-cy="chat-input"]').invoke("val").should("equal", "");
  });
});
