const { hostWsServer, newClient } = require("../wsHelpers");

describe("Socket Server", () => {
  let wsServer, httpServer;
  beforeAll(() => {
    [wsServer, httpServer] = hostWsServer();
  });

  beforeEach(() => {
    wsServer.clients.forEach((client) => {
      client.close();
    });
  });

  afterAll(() => {
    wsServer.clients.forEach((client) => {
      client.close();
    });
    httpServer.close();
  });

  describe("broadcast messages to all clients", () => {
    it("can connect to the server", async () => {
      const client = await newClient();
      expect(client.readyState).toEqual(1);
    });

    it("sends message back to the client", async () => {
      const client = await newClient();
      const messages = [];
      client.on("message", (data) => {
        messages.push(data.toString());
        client.close();
      });

      client.send("test message");

      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (client.readyState === 3) {
            clearInterval(interval);
            resolve();
          }
        }, 10);
      });

      expect(client.readyState === 3);
      expect(messages.length).toEqual(1);
      expect(messages[0]).toEqual("test message");
    });
  });
});
