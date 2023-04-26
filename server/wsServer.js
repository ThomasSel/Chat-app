const WebSocket = require("ws");

const wsServer = new WebSocket.WebSocketServer({ noServer: true });

module.exports = wsServer;
