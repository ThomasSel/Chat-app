import React, { useState } from "react";

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
    <div>
      <h1 data-cy="chat-name">{name}</h1>

      <ul data-cy="chat-messages">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          data-cy="chat-input"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <input type="submit" value="Send" data-cy="chat-submit" />
      </form>
    </div>
  );
};

export default Chat;
