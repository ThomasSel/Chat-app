const app = require("../../app");
const request = require("supertest");
const testHelpers = require("../testHelpers");
const User = require("../../models/user");
const jwt = require("jsonwebtoken");

describe("Login routes", () => {
  beforeAll(async () => {
    await testHelpers.connect();
    const user = new User({
      email: "test@test.com",
      username: "fakeUsername",
      password: "1234Password1234",
    });
    await user.save();
  });

  afterAll(async () => {
    await testHelpers.disconnect();
  });

  describe("when the correct credentials are provided", () => {
    let response, tokenPayload;
    beforeAll(async () => {
      response = await request(app)
        .post("/login")
        .send({ email: "test@test.com", password: "1234Password1234" });
      tokenPayload = jwt.verify(response.body.token, process.env.JWT_SECRET);
    });

    it("responds with 200 status code", () => {
      expect(response.statusCode).toEqual(200);
    });

    it("responds with a message", () => {
      expect(response.body.message).toEqual("success");
    });

    it("responds with a valid token", () => {
      expect(tokenPayload).toMatchObject({ iat: expect.any(Number) });
    });

    it("responds with a token containing the user's id", () => {
      expect(tokenPayload).toMatchObject({ userId: expect.any(String) });
    });

    it("responds with a token containing the user's username", () => {
      expect(tokenPayload).toMatchObject({ username: "fakeUsername" });
    });
  });

  describe("when incorrect email is provided", () => {
    let response;
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
    let response;
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
