import ws from "ws";
import jwt from "jsonwebtoken";

const wsServer = new ws.WebSocketServer({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.on("error", console.error);
  socket.on("close", () => {});

  socket.onmessage = async (e: ws.MessageEvent) => {
    try {
      const data = JSON.parse(e.data.toString());
      const payload = await new Promise<jwt.JwtPayload>((resolve, reject) => {
        if (process.env.JWT_SECRET === undefined) {
          return reject(new Error("Missing JWT_SECRET environment variable"));
        }

        jwt.verify(
          data.token,
          process.env.JWT_SECRET,
          (error: any, payload: any) => {
            if (error) {
              return reject(error);
            }
            resolve(payload);
          }
        );
      });
    } catch (err) {
      console.error(err);
      socket.close();
    }

    socket.onmessage = (newE: ws.MessageEvent) => {
      wsServer.clients.forEach((client) => {
        client.send(newE.data.toString());
      });
    };
  };
});

export default wsServer;
