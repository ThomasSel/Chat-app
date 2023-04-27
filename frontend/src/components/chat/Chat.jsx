const Chat = (props) => {
  return (
    <div>
      <h1>{props.name}</h1>
      <div>
        <ul>
          {props.messages.map((message) => (
            <li>{message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Chat;
