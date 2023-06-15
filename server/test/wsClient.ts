import ws from "ws";
import jwt from "jsonwebtoken";

class wsClient {
  socket: ws.WebSocket;
  messages: string[];
  ready: Promise<void>;
  closed: Promise<void>;

  constructor(address: string) {
    this.socket = new ws.WebSocket(address);
    this.messages = [];

    this.ready = new Promise((resolve, reject) => {
      const handleClose = (e: ws.ErrorEvent | ws.CloseEvent) => reject();
      this.socket.addEventListener("error", handleClose);
      this.socket.addEventListener("close", handleClose);

      this.socket.onopen = (e) => {
        resolve();
        this.socket.removeEventListener("error", handleClose);
        this.socket.removeEventListener("close", handleClose);
      };
    });

    this.closed = new Promise((resolve) => {
      this.socket.addEventListener("error", (e) => resolve());
      this.socket.addEventListener("close", (e) => resolve());
    });
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
    return this.ready;
  }

  waitClosed() {
    return this.closed;
  }
}

export default wsClient;
