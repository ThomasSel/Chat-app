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

  it("can connect to the server", async () => {
    const client = new wsClient(wsAddress);

    await client.waitReady();
    expect(client.socket.readyState).toEqual(1);
  });

  describe("valid initial authentication message", () => {
    const token = jwt.sign(
      {
        userId: "12345678",
        username: "fakeUsername",
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

      const received = client.expectMessages(1);
      await client.send("test message");
      await received;

      expect(client.messages.length).toEqual(1);
    });
  });

  describe("invalid authentication message", () => {
    it("closes the connection with invalid signature", async () => {
      const token = jwt.sign(
        {
          userId: "12345678",
          username: "fakeUsername",
        },
        "incorrectSecret"
      );

      const client = new wsClient(wsAddress);
      await client.send(JSON.stringify({ token: token }));

      await client.waitClosed();
      expect(client.readyState).toEqual(3);
    });

    it("closes the connection with missing userId", async () => {
      const token = jwt.sign(
        {
          username: "fakeUsername",
        },
        secret
      );

      const client = new wsClient(wsAddress);
      await client.send(JSON.stringify({ token: token }));

      await client.waitClosed();
      expect(client.readyState).toEqual(3);
    });

    it("closes the connection with missing username", async () => {
      const token = jwt.sign(
        {
          userId: "12345678",
        },
        secret
      );

      const client = new wsClient(wsAddress);
      await client.send(JSON.stringify({ token: token }));

      await client.waitClosed();
      expect(client.readyState).toEqual(3);
    });
  });
});
