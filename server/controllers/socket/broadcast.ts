import ws from "ws";

import { Client } from "../../wsServer";

type ClientMessageData = {
  message: string;
};

type ServerMessageData = {
  text: string;
  userId: string;
  username: string;
  iat: number;
};

const isMessageData = (o: any): o is ClientMessageData => {
  return "message" in o;
};

const broadcastMessage = (
  e: ws.MessageEvent,
  client: Client,
  clients: Iterable<Client>
) => {
  if (client.userId === undefined || client.username === undefined) {
    throw new Error("Client does not have a userId or password");
  }

  let messageData: ClientMessageData;
  try {
    const messageDataString = e.data.toString();

    const data = JSON.parse(messageDataString);
    if (!isMessageData(data)) {
      throw new Error("Message JSON doesn't contain the right keys");
    }

    messageData = data;
  } catch (err) {
    return console.error(err);
  }

  const iat = Date.now();
  const serverMessageData: ServerMessageData = {
    text: messageData.message,
    userId: client.userId,
    username: client.username,
    iat: iat,
  };

  for (let c of clients) {
    try {
      c.socket.send(JSON.stringify(serverMessageData));
    } catch (err) {
      console.error(
        `Tried to send a message to a client with readyState ${c.socket.readyState}`
      );
    }
  }
};

export default broadcastMessage;
