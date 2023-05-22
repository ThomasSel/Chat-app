import request from "supertest";

import app from "../../app";
import { connect, disconnect } from "../testHelpers";
import User from "../../models/user";
import jwt from "jsonwebtoken";

describe("Login routes", () => {
  beforeAll(async () => {
    await connect();
    const user = new User({
      email: "test@test.com",
      username: "fakeUsername",
      password: "1234Password1234",
    });
    await user.save();
  });

  afterAll(async () => {
    await disconnect();
  });

  describe("when a field is missing", () => {
    it("responds with 400 status code if email is missing", async () => {
      const response = await request(app)
        .post("/login")
        .send({ password: "1234Password1234" });
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({ message: "Bad request" });
    });

    it("responds with 400 status code if password is missing", async () => {
      const response = await request(app)
        .post("/login")
        .send({ email: "test@test.com" });
      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({ message: "Bad request" });
    });
  });

  describe("when the correct credentials are provided", () => {
    let response: request.Response, tokenPayload: string | jwt.JwtPayload;
    beforeAll(async () => {
      response = await request(app)
        .post("/login")
        .send({ email: "test@test.com", password: "1234Password1234" });

      const secret = process.env.JWT_SECRET ?? "testSecret";
      tokenPayload = jwt.verify(response.body.token, secret);
    });

    it("responds with 200 status code", () => {
      expect(response.statusCode).toEqual(200);
    });

    it("responds with a message", () => {
      expect(response.body.message).toEqual("success");
    });

    it("responds with a valid token", () => {
      expect(tokenPayload).toMatchObject({ iat: expect.any(Number) });
      expect(() => jwt.verify(response.body.token, "wrong token")).toThrow(
        "invalid signature"
      );
    });

    it("responds with a token containing the user's id", () => {
      expect(tokenPayload).toMatchObject({ userId: expect.any(String) });
    });

    it("responds with a token containing the user's username", () => {
      expect(tokenPayload).toMatchObject({ username: "fakeUsername" });
    });
  });

  describe("when incorrect email is provided", () => {
    let response: request.Response;
    beforeAll(async () => {
      response = await request(app)
        .post("/login")
        .send({ email: "wrong@email.com", password: "1234Password1234" });
    });

    it("responds with 401 status", async () => {
      expect(response.statusCode).toEqual(401);
    });

    it("responds with unauthorized message", async () => {
      expect(response.body).toEqual({ message: "Invalid details" });
    });
  });

  describe("when incorrect password is provided", () => {
    let response: request.Response;
    beforeAll(async () => {
      response = await request(app)
        .post("/login")
        .send({ email: "test@test.com", password: "4321password4321" });
    });

    it("responds with 401 status", async () => {
      expect(response.statusCode).toEqual(401);
    });

    it("responds with unauthorized message", async () => {
      expect(response.body).toEqual({ message: "Invalid details" });
    });
  });
});
