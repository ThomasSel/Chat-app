import ws from "ws";
import jwt from "jsonwebtoken";

class wsClient {
  socket: ws.WebSocket;
  messages: string[];

  constructor(address: string) {
    this.socket = new ws.WebSocket(address);
    this.messages = [];
  }

  get readyState() {
    return this.socket.readyState;
  }

  async authenticate(user?: { userId: string; username: string }) {
    if (process.env.JWT_SECRET === undefined) {
      throw new Error("Missing JWT_SECRET environment variable");
    }

    const token = jwt.sign(
      user ?? {
        userId: "12345678",
        username: "fakeUsername",
      },
      process.env.JWT_SECRET
    );

    await this.send(JSON.stringify({ token: token }));
  }

  async expectMessages(numMessages: number) {
    await this.waitReady();

    this.socket.on("message", (data) => {
      this.messages.push(data.toString());

      if (this.messages.length >= numMessages) {
        this.socket.close();
      }
    });

    await this.waitClosed();
  }

  async send(data: string) {
    await this.waitReady();
    this.socket.send(data);
  }

  close() {
    this.socket.close();
    return this.waitClosed();
  }

  waitReady() {
    return new Promise<void>((resolve, reject) => {
      const interval = setInterval(() => {
        switch (this.socket.readyState) {
          case 0:
            break;
          case 1:
            clearInterval(interval);
            resolve();
            break;
          default:
            clearInterval(interval);
            reject(new Error("ws connection is closed"));
        }
      }, 10);
    });
  }

  waitClosed() {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this.socket.readyState === 3) {
          clearInterval(interval);
          resolve();
        }
      }, 10);
    });
  }
}

export default wsClient;
