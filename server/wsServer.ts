import ws from "ws";
import jwt from "jsonwebtoken";

import authenticateSocket from "./controllers/socket/auth";
import broadcastMessage from "./controllers/socket/broadcast";

const wsServer = new ws.WebSocketServer({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.on("error", console.error);
  socket.on("close", () => {});

  socket.onmessage = async (e: ws.MessageEvent) => {
    authenticateSocket(e, socket);

    socket.onmessage = (newE: ws.MessageEvent) => {
      broadcastMessage(newE, wsServer.clients);
    };
  };
});

export default wsServer;
