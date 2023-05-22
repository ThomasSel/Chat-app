type ChatProps = {
  name: string;
  messages: string[];
};

const Chat = ({ name, messages }: ChatProps): JSX.Element => {
  return (
    <div>
      <h1 data-cy="chat-name">{name}</h1>

      <ul data-cy="chat-messages">
        {messages.map((message) => (
          <li>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
