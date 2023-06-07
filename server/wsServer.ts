import ws from "ws";

import authenticateSocket from "./controllers/socket/auth";
import broadcastMessage from "./controllers/socket/broadcast";

export type Client = {
  socket: ws.WebSocket;
  userId?: string;
  username?: string;
};

const wsServer = new ws.WebSocketServer({ noServer: true });

const clients = new Set<Client>();

wsServer.on("connection", (socket) => {
  const client: Client = {
    socket: socket,
  };

  socket.on("error", console.error);
  socket.on("close", () => {
    clients.delete(client);
  });

  socket.onmessage = async (e: ws.MessageEvent) => {
    await authenticateSocket(e, client, clients);

    socket.onmessage = (newE: ws.MessageEvent) => {
      broadcastMessage(newE, client, clients);
    };
  };
});

export default wsServer;
