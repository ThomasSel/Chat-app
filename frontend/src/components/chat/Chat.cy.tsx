import { Message } from "../home/Home";
import Chat from "./Chat";

const messages: Message[][] = [
  [
    {
      text: "firstMessage",
      userId: "12345678",
      username: "UserOne",
      iat: 1686155440000,
    },
    {
      text: "secondMessage",
      userId: "12345678",
      username: "UserOne",
      iat: 1686155450000,
    },
  ],
  [
    {
      text: "thirdMessage",
      userId: "87654321",
      username: "UserTwo",
      iat: 1686155460000,
    },
  ],
];

describe("Chat", () => {
  let socketMock: any;
  beforeEach(() => {
    socketMock = { send: (data: string): void => {} };
  });

  it("displays the name of the chat", () => {
    cy.mount(
      <Chat name="Test" messages={[]} socket={socketMock} userId={"12345678"} />
    );

    cy.get('[data-cy="chat-name"]').should("contain", "Test");
  });

  it("when messages are empty, displays nothing", () => {
    cy.mount(
      <Chat name="Test" messages={[]} socket={socketMock} userId={"12345678"} />
    );

    cy.get('[data-cy="chat-messages"]').should("not.contain.text");
  });

  it("displays all messages given as props", () => {
    cy.mount(
      <Chat
        name="Test"
        messages={messages}
        socket={socketMock}
        userId={"12345678"}
      />
    );

    cy.get('[data-cy="chat-messages"]')
      .should("contain.text", "firstMessage")
      .and("contain.text", "secondMessage")
      .and("contain.text", "thirdMessage");
  });

  it("shows other message sender's username (not self)", () => {
    cy.mount(
      <Chat
        name="Test"
        messages={messages}
        socket={socketMock}
        userId={"12345678"}
      />
    );

    cy.get('[data-cy="chat-messages"]')
      .should("not.contain.text", "UserOne")
      .and("contain.text", "UserTwo");
  });

  it("styles messages from others differently", () => {
    cy.mount(
      <Chat
        name="Test"
        messages={messages}
        socket={socketMock}
        userId={"12345678"}
      />
    );

    cy.get(".chat-message-self")
      .should("contain.text", "firstMessage")
      .and("contain.text", "secondMessage");
    cy.get(".chat-message").should("contain.text", "thirdMessage");

    cy.mount(
      <Chat
        name="Test"
        messages={messages}
        socket={socketMock}
        userId={"87654321"}
      />
    );

    cy.get(".chat-message")
      .should("contain.text", "firstMessage")
      .and("contain.text", "secondMessage");
    cy.get(".chat-message-self").should("contain.text", "thirdMessage");
  });

  it("groups messages properly", () => {
    cy.mount(
      <Chat
        name="Test"
        messages={messages}
        socket={socketMock}
        userId={"87654321"}
      />
    );

    cy.get(".message-sender").should("have.length", 1);
  });

  describe("message input", () => {
    it("has an input box and a submit button", () => {
      cy.mount(
        <Chat
          name="Test"
          messages={[]}
          socket={socketMock}
          userId={"12345678"}
        />
      );

      cy.get('[data-cy="chat-input"]').should("be.visible");
      cy.get('[data-cy="chat-submit"]').should("be.visible");
    });

    it("sends a message when clicking submit", () => {
      cy.spy(socketMock, "send").as("socketMock");

      cy.mount(
        <Chat
          name="Test"
          messages={[]}
          socket={socketMock}
          userId={"12345678"}
        />
      );

      cy.get('[data-cy="chat-input"]').type("testMessage");
      cy.get('[data-cy="chat-submit"]').click();

      cy.get("@socketMock").should(
        "be.calledWith",
        '{"message":"testMessage"}'
      );
    });

    it("sets the message input blank after submitting", () => {
      cy.mount(
        <Chat
          name="Test"
          messages={[]}
          socket={socketMock}
          userId={"12345678"}
        />
      );

      cy.get('[data-cy="chat-input"]').type("testMessage");
      cy.get('[data-cy="chat-submit"]').click();

      cy.get('[data-cy="chat-input"]').invoke("val").should("equal", "");
    });
  });
});
