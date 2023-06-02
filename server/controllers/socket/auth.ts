import ws from "ws";
import jwt from "jsonwebtoken";

const authenticateSocket = async (
  e: ws.MessageEvent,
  socket: ws.WebSocket,
  clients: Set<ws.WebSocket>
) => {
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

    if (payload.userId === undefined || payload.username === undefined) {
      throw new Error("Missing JWT payloads");
    }

    clients.add(socket);
  } catch (err) {
    console.error(err);
    socket.close();
  }
};

export default authenticateSocket;
