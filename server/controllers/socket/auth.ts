import ws from "ws";
import jwt from "jsonwebtoken";

import { Client } from "../../wsServer";

const authenticateSocket = async (
  e: ws.MessageEvent,
  client: Client,
  clients: Set<Client>
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

    client.userId = payload.userId;
    client.username = payload.username;
    clients.add(client);
  } catch (err) {
    console.error(err);
    client.socket.close();
  }
};

export default authenticateSocket;
