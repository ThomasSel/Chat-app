import ws from "ws";

import authenticateSocket from "./controllers/socket/auth";
import broadcastMessage from "./controllers/socket/broadcast";

const wsServer = new ws.WebSocketServer({ noServer: true });

const clients = new Set<ws.WebSocket>();

wsServer.on("connection", (socket) => {
  socket.on("error", console.error);
  socket.on("close", () => {
    clients.delete(socket);
  });

  socket.onmessage = async (e: ws.MessageEvent) => {
    await authenticateSocket(e, socket, clients);

    socket.onmessage = (newE: ws.MessageEvent) => {
      broadcastMessage(newE, clients);
    };
  };
});

export default wsServer;
