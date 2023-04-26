const { hostWsServer } = require("../wsHelpers");
const wsClient = require("../wsClient");

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
      const client = new wsClient();

      await client.waitReady();
      expect(client.socket.readyState).toEqual(1);
    });

    it("sends message back to the client", async () => {
      const client = new wsClient();
      const received = client.expectMessages(1);

      client.send("test message");

      await received;

      expect(client.messages.length).toEqual(1);
      expect(client.messages[0]).toEqual("test message");
    });
  });
});
