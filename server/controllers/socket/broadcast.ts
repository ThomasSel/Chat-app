import ws from "ws";

type messageData = {
  message: string;
};

const isMessageData = (o: any): o is messageData => {
  return "message" in o;
};

const broadcastMessage = (
  e: ws.MessageEvent,
  clients: Iterable<ws.WebSocket>
) => {
  let messageData: messageData;

  try {
    const messageDataString = e.data.toString();
    const data = JSON.parse(messageDataString);

    if (isMessageData(data)) {
      messageData = data;
    } else {
      throw new Error("Message JSON doesn't contain the right keys");
    }
  } catch (err) {
    return console.error(err);
  }

  for (let client of clients) {
    try {
      client.send(messageData.message);
    } catch (err) {
      console.error(
        `Tried to send a message to a client with readyState ${client.readyState}`
      );
    }
  }
};

export default broadcastMessage;
