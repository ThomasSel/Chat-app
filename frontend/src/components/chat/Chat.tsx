import { useState } from "react";

type ChatProps = {
  name: string;
  messages: string[];
};

const Chat = ({ name, messages }: ChatProps): JSX.Element => {
  const [message, setMessage] = useState<string>("");

  return (
    <div>
      <h1 data-cy="chat-name">{name}</h1>

      <ul data-cy="chat-messages">
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </ul>

      <form>
        <input
          type="text"
          data-cy="chat-input"
          onChange={(e) => setMessage(e.target.value)}
        />
        <input type="submit" value="Send" data-cy="chat-submit" />
      </form>
    </div>
  );
};

export default Chat;
