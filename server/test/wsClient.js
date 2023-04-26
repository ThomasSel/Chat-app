const ws = require("ws");
const { WS_ADDRESS } = require("./wsHelpers");

class wsClient {
  constructor(address = WS_ADDRESS) {
    this.socket = new ws.WebSocket(address);
    this.messages = [];
  }

  async expectMessages(numMessages) {
    await this.waitReady();

    this.socket.on("message", (data) => {
      this.messages.push(data.toString());

      if (this.messages.length >= numMessages) {
        this.socket.close();
      }
    });

    await this.waitClosed();
  }

  async send(data) {
    await this.waitReady();
    this.socket.send(data);
  }

  close(data) {
    this.socket.close();
    return this.waitClosed();
  }

  waitReady() {
    return new Promise((resolve, reject) => {
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
      });
    }, 10);
  }

  waitClosed() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.socket.readyState === 3) {
          clearInterval(interval);
          resolve();
        }
      });
    }, 10);
  }
}

module.exports = wsClient;
