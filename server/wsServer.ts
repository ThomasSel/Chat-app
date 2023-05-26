import WebSocket from "ws";

const wsServer = new WebSocket.WebSocketServer({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.on("error", console.error);
  socket.on("close", () => {});

  socket.on("message", (data) => {
    wsServer.clients.forEach((client) => {
      client.send(data);
    });
  });
});

export default wsServer;
