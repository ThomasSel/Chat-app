type ChatProps = {
  name: string;
  messages: string[];
};

const Chat = ({ name, messages }: ChatProps): JSX.Element => {
  return (
    <div>
      <h1>{name}</h1>
      <div>
        <ul>
          {messages.map((message) => (
            <li>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
