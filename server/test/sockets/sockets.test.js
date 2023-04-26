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

    it("sends message to other clients", async () => {
      const client1 = new wsClient();
      const client2 = new wsClient();
      const client3 = new wsClient();

      const received1 = client1.expectMessages(1);
      const received2 = client2.expectMessages(1);

      client3.send("test message");

      await Promise.all([received1, received2]);

      expect(client1.messages[0]).toEqual("test message");
      expect(client2.messages[0]).toEqual("test message");
    });

    it("receives messages from other clients", async () => {
      const client1 = new wsClient();
      const client2 = new wsClient();
      const client3 = new wsClient();

      const received1 = client1.expectMessages(3);
      const received2 = client2.expectMessages(3);
      const received3 = client3.expectMessages(3);

      client1.send("client1");
      client2.send("client2");
      client3.send("client3");

      await Promise.all([received1, received2, received3]);

      expect(client1.messages).toContain("client1", "client2", "client3");
      expect(client2.messages).toContain("client1", "client2", "client3");
      expect(client2.messages).toContain("client1", "client2", "client3");
    });
  });
});
