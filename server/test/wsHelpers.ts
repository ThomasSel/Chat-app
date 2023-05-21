import wsServer from "../wsServer";
import http from "node:http";

export const WS_PORT = parseInt(process.env.WS_PORT ?? "8100");
export const WS_ADDRESS = `ws://localhost:${WS_PORT}`;

export const hostWsServer = () => {
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
