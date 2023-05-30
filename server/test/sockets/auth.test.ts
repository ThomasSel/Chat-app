import ws from "ws";
import http from "http";
import { AddressInfo } from "net";

import jwt from "jsonwebtoken";

import { hostWsServer } from "../wsHelpers";
import wsClient from "../wsClient";

describe("Socket Auth", () => {
  let wsServer: ws.Server, httpServer: http.Server;
  let addressInfo: AddressInfo, wsAddress: string;
  const secret = process.env.JWT_SECRET ?? "fakeSecret";

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

  describe("valid initial authentication message", () => {
    const token = jwt.sign(
      {
        userId: "12345678",
        username: "fakeUsername",
        iat: Math.floor(Date.now() / 1000),
      },
      secret
    );

    it("doesn't close the connection if the auth token is valid", async () => {
      const client = new wsClient(wsAddress);

      await client.send(JSON.stringify({ token: token }));

      expect(client.readyState).toEqual(1);
    });

    it("doesn't close the connection on subsequent messages", async () => {
      const client = new wsClient(wsAddress);

      await client.send(JSON.stringify({ token: token }));

      const recieved = client.expectMessages(1);
      await client.send("test message");
      await recieved;

      expect(client.messages.length).toEqual(1);
    });
  });

  describe("invalid authentication message", () => {
    it("closes the connection with invalid signature", async () => {
      const token = jwt.sign(
        {
          userId: "12345678",
          username: "fakeUsername",
          iat: Math.floor(Date.now() / 1000),
        },
        "incorrectSecret"
      );

      const client = new wsClient(wsAddress);
      await client.send(JSON.stringify({ token: token }));

      await client.waitClosed();
      expect(client.readyState).toBeGreaterThan(1);
    });
  });
});
