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
  });
});
