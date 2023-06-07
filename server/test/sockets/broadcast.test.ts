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

  describe("when not authenticated", () => {
    it("doesn't send auth message to other clients", async () => {
      const client1 = new wsClient(wsAddress);
      const client2 = new wsClient(wsAddress);

      await client1.authenticate();
      const received = client1.expectMessages(1);

      await client2.authenticate();
      client2.send(JSON.stringify({ message: "fakeMessage" }));

      await received;
      expect(client1.messages[0]).toEqual("fakeMessage");
    });

    it("doesn't receive messsages from other clients", async () => {
      const client1 = new wsClient(wsAddress);
      const client2 = new wsClient(wsAddress);

      const received = client1.expectMessages(1);

      await client2.authenticate();
      client2.send(
        JSON.stringify({
          message: "This message shouldn't be broadcast to client1",
        })
      );

      await client1.authenticate();
      client2.send(
        JSON.stringify({
          message: "This message should be broadcast to client1",
        })
      );

      await received;
      expect(client1.messages[0]).toEqual(
        "This message should be broadcast to client1"
      );
    });
  });

  describe("when authenticated", () => {
    describe("invalid message JSON", () => {
      it("doesn't broadcast non JSON message", async () => {
        const client1 = new wsClient(wsAddress);
        const client2 = new wsClient(wsAddress);

        await Promise.all([client1.authenticate(), client2.authenticate()]);

        const received = client2.expectMessages(1);

        client1.send("first message");
        client1.send(JSON.stringify({ message: "second message" }));

        await received;

        expect(client2.messages[0]).toEqual("second message");
      });

      it("doesn't broadcast when JSON keys are invalid", async () => {
        const client1 = new wsClient(wsAddress);
        const client2 = new wsClient(wsAddress);

        await Promise.all([client1.authenticate(), client2.authenticate()]);

        const received = client2.expectMessages(1);

        client1.send(JSON.stringify({ text: "first message" }));
        client1.send(JSON.stringify({ message: "second message" }));

        await received;

        expect(client2.messages[0]).toEqual("second message");
      });
    });

    it("sends message back to the client", async () => {
      const client = new wsClient(wsAddress);
      const received = client.expectMessages(1);

      await client.authenticate();
      client.send(JSON.stringify({ message: "test message" }));

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

      client3.send(JSON.stringify({ message: "test message" }));

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

      client1
        .authenticate()
        .then(() => client1.send(JSON.stringify({ message: "client1" })));
      client2
        .authenticate()
        .then(() => client2.send(JSON.stringify({ message: "client2" })));
      client3
        .authenticate()
        .then(() => client3.send(JSON.stringify({ message: "client3" })));

      await Promise.all([received1, received2, received3]);

      ["client1", "client2", "client3"].forEach((value) => {
        expect(client1.messages).toContain(value);
        expect(client2.messages).toContain(value);
        expect(client2.messages).toContain(value);
      });
    });
  });
});
