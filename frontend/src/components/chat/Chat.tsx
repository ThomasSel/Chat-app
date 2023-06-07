import React, { useRef, useState, useEffect } from "react";

import { Message } from "../home/Home";
import "./Chat.css";

type ChatProps = {
  name: string;
  messages: Message[];
  socket: WebSocket;
};

const Chat = ({ name, messages, socket }: ChatProps): JSX.Element => {
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
        {messages.map((message, index) => (
          <li key={index} className="chat-message">
            {message.text}
          </li>
        ))}
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
