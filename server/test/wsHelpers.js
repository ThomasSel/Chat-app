const ws = require("ws");
const wsServer = require("../wsServer");
const http = require("node:http");

const WS_PORT = process.env.WS_PORT || 8100;

const hostWsServer = () => {
  const httpServer = http.createServer();

  // Attach the ws server to the http server
  httpServer.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (socket) => {
      wsServer.emit("connection", socket, req);
    });
  });

  httpServer.listen(WS_PORT);

  return [wsServer, httpServer];
};

const newClient = async (address = `ws://localhost:${WS_PORT}`) => {
  const client = new ws.WebSocket(address);
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      switch (client.readyState) {
        case 0:
          break;
        case 1:
          clearInterval(interval);
          resolve(client);
          break;
        default:
          clearInterval(interval);
          reject(new Error("Failed to connect to ws server"));
      }
    }, 10);
  });
};

module.exports = { hostWsServer, newClient };
