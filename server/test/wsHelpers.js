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

module.exports = hostWsServer;
