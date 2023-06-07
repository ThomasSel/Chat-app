import ws from "ws";

/*
 * A websocket wrapper with debugging listeners already defined
 * Mainly designed for use inside of the ts-node REPL
 */
export default class DebugClient {
  static count: number = 0;

  id: number;
  socket: ws.WebSocket;

  constructor(address: string) {
    this.socket = new ws.WebSocket(address);
    this.id = DebugClient.count;
    DebugClient.count += 1;

    this.socket.addEventListener("open", () => {
      console.log(`SOCKET ${this.id} - Connection open`);
    });

    this.socket.addEventListener("close", () => {
      console.log(`SOCKET ${this.id} - Connection closed`);
    });

    this.socket.addEventListener("error", (e) => {
      console.error(`SOCKET ${this.id} - Connection error:`);
      console.error(e.message);
    });

    this.socket.addEventListener("message", (e) => {
      console.log(`SOCKET ${this.id} - Received message:`);
      console.log(e.data.toString() + "\n");
    });
  }

  send(message: string) {
    this.socket.send(message);
  }

  close() {
    this.socket.close();
  }

  get readyState() {
    return this.socket.readyState;
  }
}
