import React, { useRef, useState, useEffect } from "react";

import { Message } from "../home/Home";
import "./Chat.css";

type ChatProps = {
  name: string;
  messages: Message[][];
  socket: WebSocket;
  userId: string;
};

const Chat = ({ name, messages, socket, userId }: ChatProps): JSX.Element => {
  const [messageInput, setMessageInput] = useState<string>("");
  const messagesRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    messagesRef?.current.scrollTo({ top: Number.MAX_SAFE_INTEGER });
  }, [messages]);

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    socket.send(JSON.stringify({ message: messageInput }));
    setMessageInput("");
  };

  return (
    <div className="current-chat">
      <h1 data-cy="chat-name">{name}</h1>

      <ul data-cy="chat-messages" className="chat-messages" ref={messagesRef}>
        {messages.map((messageGroup) => {
          return (
            <ul className="message-group">
              {messageGroup[0].userId === userId ? (
                messageGroup.map((message) => (
                  <li
                    key={`${message.userId}-${message.iat}-${message.text[0]}`}
                    className="chat-message-self"
                  >
                    {message.text}
                  </li>
                ))
              ) : (
                <>
                  <div className="message-sender" data-cy="message-sender">
                    {messageGroup[0].username}
                  </div>
                  {messageGroup.map((message) => (
                    <li
                      key={`${message.userId}-${message.iat}-${message.text[0]}`}
                      className="chat-message"
                    >
                      {message.text}
                    </li>
                  ))}
                </>
              )}
              {/* {messageGroup.map((message) => {
                if (message.userId === userId) {
                  return (
                    <li
                      key={`${message.userId}-${message.iat}-${message.text[0]}`}
                    >
                      <div className="chat-message-self">{message.text}</div>
                    </li>
                  );
                } else {
                  return (
                    <li
                      key={`${message.userId}-${message.iat}-${message.text[0]}`}
                    >
                      <div className="message-sender">{message.username}</div>
                      <div className="chat-message">{message.text}</div>
                    </li>
                  );
                } }
              })*/}
            </ul>
          );
        })}
      </ul>

      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          data-cy="chat-input"
          onChange={(e) => setMessageInput(e.target.value)}
          value={messageInput}
          placeholder={`Send a message to #${name}`}
          className="message-input"
        />
        <input
          type="submit"
          value="Send"
          data-cy="chat-submit"
          className="message-send"
        />
      </form>
    </div>
  );
};

export default Chat;
