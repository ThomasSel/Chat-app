import ws from "ws";
import wsServer from "../wsServer";
import http from "node:http";

export const hostWsServer = (port: number = 0): [ws.Server, http.Server] => {
  const httpServer = http.createServer();

  // Attach the ws server to the http server
  httpServer.on("upgrade", (req, socket, head) => {
    wsServer.handleUpgrade(req, socket, head, (socket) => {
      wsServer.emit("connection", socket, req);
    });
  });

  httpServer.listen(port);

  return [wsServer, httpServer];
};
