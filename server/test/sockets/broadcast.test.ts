import ws from "ws";
import http from "http";
import { AddressInfo } from "net";

import { hostWsServer } from "../wsHelpers";
import wsClient from "../wsClient";

describe("Socket Server", () => {
  let wsServer: ws.Server, httpServer: http.Server;
  let addressInfo: AddressInfo, wsAddress: string;
  beforeAll(() => {
    [wsServer, httpServer] = hostWsServer();
    addressInfo = <AddressInfo>httpServer.address();
    wsAddress = `ws://localhost:${addressInfo.port}/`;
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

  describe("broadcast messages to authenticated clients", () => {
    it("sends message back to the client", async () => {
      const client = new wsClient(wsAddress);
      const received = client.expectMessages(1);

      await client.authenticate();
      client.send("test message");

      await received;

      expect(client.messages.length).toEqual(1);
      expect(client.messages[0]).toEqual("test message");
    });

    it("sends message to other authenticated clients", async () => {
      const client1 = new wsClient(wsAddress);
      const client2 = new wsClient(wsAddress);
      const client3 = new wsClient(wsAddress);

      await Promise.all([
        client1.authenticate(),
        client2.authenticate(),
        client3.authenticate(),
      ]);

      const received1 = client1.expectMessages(1);
      const received2 = client2.expectMessages(1);

      client3.send("test message");

      await Promise.all([received1, received2]);

      expect(client1.messages[0]).toEqual("test message");
      expect(client2.messages[0]).toEqual("test message");
    });

    it("receives messages from other authenticated clients", async () => {
      const client1 = new wsClient(wsAddress);
      const client2 = new wsClient(wsAddress);
      const client3 = new wsClient(wsAddress);

      const received1 = client1.expectMessages(3);
      const received2 = client2.expectMessages(3);
      const received3 = client3.expectMessages(3);

      client1.authenticate().then(() => client1.send("client1"));
      client2.authenticate().then(() => client2.send("client2"));
      client3.authenticate().then(() => client3.send("client3"));

      await Promise.all([received1, received2, received3]);

      ["client1", "client2", "client3"].forEach((value) => {
        expect(client1.messages).toContain(value);
        expect(client2.messages).toContain(value);
        expect(client2.messages).toContain(value);
      });
    });
  });

  describe("when not authenticated", () => {
    it("doesn't send auth message to other clients", async () => {
      const client1 = new wsClient(wsAddress);
      const client2 = new wsClient(wsAddress);

      await client1.authenticate();
      const received = client1.expectMessages(1);

      await client2.authenticate();
      client2.send("fakeMessage");

      await received;
      expect(client1.messages[0]).toEqual("fakeMessage");
    });

    it("doesn't broadcast messages to unauthenticated clients", async () => {
      const client1 = new wsClient(wsAddress);
      const client2 = new wsClient(wsAddress);

      const received = client1.expectMessages(1);

      await client2.authenticate();
      client2.send("This message shouldn't be broadcast to client1");

      await client1.authenticate();
      client2.send("This message should be broadcast to client1");

      await received;
      expect(client1.messages[0]).toEqual(
        "This message should be broadcast to client1"
      );
    });
  });
});
