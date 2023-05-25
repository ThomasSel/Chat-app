import React, { useState } from "react";
import "./Chat.css";

type ChatProps = {
  name: string;
  messages: string[];
  socket: WebSocket;
};

const Chat = ({ name, messages, socket }: ChatProps): JSX.Element => {
  const [message, setMessage] = useState<string>("");

  const handleSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    socket.send(message);
    setMessage("");
  };

  return (
    <div className="current-chat">
      <h1 data-cy="chat-name">{name}</h1>

      <div className="chat-wrapper">
        <ul data-cy="chat-messages" className="chat-messages">
          {messages.map((message) => (
            <li key={message} className="chat-message">
              {message}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSubmit} className="message-form">
          <input
            type="text"
            data-cy="chat-input"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
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
    </div>
  );
};

export default Chat;
