import ws from "ws";
import http from "http";
import { AddressInfo } from "net";

import { hostWsServer } from "../wsHelpers";
import wsClient from "../wsClient";

type ServerMessageData = {
  text: string;
  userId: string;
  username: string;
  iat: number;
};

const isServerMessageData = (o: object): o is ServerMessageData => {
  return "text" in o && "userId" in o && "username" in o && "iat" in o;
};

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
      expect(client1.messages[0]).toContain("fakeMessage");
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
      expect(client1.messages[0]).toContain(
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

        expect(client2.messages[0]).toContain("second message");
      });

      it("doesn't broadcast when JSON keys are invalid", async () => {
        const client1 = new wsClient(wsAddress);
        const client2 = new wsClient(wsAddress);

        await Promise.all([client1.authenticate(), client2.authenticate()]);

        const received = client2.expectMessages(1);

        client1.send(JSON.stringify({ text: "first message" }));
        client1.send(JSON.stringify({ message: "second message" }));

        await received;

        expect(client2.messages[0]).toContain("second message");
      });
    });

    describe("broadcast messages to self", () => {
      it("sends JSON with message back to the client", async () => {
        const client = new wsClient(wsAddress);
        const received = client.expectMessages(1);

        await client.authenticate({
          userId: "12345678",
          username: "fakeUsername",
        });
        client.send(JSON.stringify({ message: "test message" }));

        await received;

        const messageData = JSON.parse(client.messages[0]);
        if (!isServerMessageData(messageData)) {
          throw new Error("Server returned the wrong data schema");
        }

        expect(messageData.text).toEqual("test message");
      });

      it("sends JSON with client's own credentials", async () => {
        const client = new wsClient(wsAddress);
        const received = client.expectMessages(1);

        await client.authenticate({
          userId: "12345678",
          username: "fakeUsername",
        });
        client.send(JSON.stringify({ message: "test message" }));

        await received;

        const messageData = JSON.parse(client.messages[0]);
        if (!isServerMessageData(messageData)) {
          throw new Error("Server returned the wrong data schema");
        }

        expect(messageData.userId).toEqual("12345678");
        expect(messageData.username).toEqual("fakeUsername");
      });

      it("sends JSON with issued time", async () => {
        const startTime = Date.now();

        const client = new wsClient(wsAddress);
        const received = client.expectMessages(1);

        await client.authenticate({
          userId: "12345678",
          username: "fakeUsername",
        });
        client.send(JSON.stringify({ message: "test message" }));

        await received;

        const endTime = Date.now();
        const messageData = JSON.parse(client.messages[0]);
        if (!isServerMessageData(messageData)) {
          throw new Error("Server returned the wrong data schema");
        }

        expect(
          startTime <= messageData.iat && messageData.iat <= endTime
        ).toEqual(true);
      });
    });

    describe("broadcasts message to other authenticated users", () => {
      it("sends message to other authenticated clients", async () => {
        const client1 = new wsClient(wsAddress);
        const client2 = new wsClient(wsAddress);
        const client3 = new wsClient(wsAddress);

        await Promise.all([
          client1.authenticate({ userId: "uijdvnxcm", username: "t6rygb" }),
          client2.authenticate({ userId: "tvbcxhzja", username: "njkeu2" }),
          client3.authenticate({ userId: "67ehbmsnd", username: "pbfysy" }),
        ]);

        const received1 = client1.expectMessages(1);
        const received2 = client2.expectMessages(1);

        client3.send(JSON.stringify({ message: "test message" }));

        await Promise.all([received1, received2]);

        const messageData1 = JSON.parse(client1.messages[0]);
        const messageData2 = JSON.parse(client2.messages[0]);
        if (
          !isServerMessageData(messageData1) ||
          !isServerMessageData(messageData2)
        ) {
          throw new Error("Server returned the wrong data schema");
        }

        expect(messageData1.text).toContain("test message");
        expect(messageData1.userId).toContain("67ehbmsnd");
        expect(messageData1.username).toContain("pbfysy");

        expect(messageData2.text).toContain("test message");
        expect(messageData2.userId).toContain("67ehbmsnd");
        expect(messageData2.username).toContain("pbfysy");
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

        [client1, client2, client3].forEach((client) => {
          const stringifiedMessages = JSON.stringify(client.messages);
          expect(stringifiedMessages).toContain("client1");
          expect(stringifiedMessages).toContain("client2");
          expect(stringifiedMessages).toContain("client3");
        });
      });
    });
  });
});
