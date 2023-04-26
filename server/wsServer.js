const WebSocket = require("ws");

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

module.exports = wsServer;
