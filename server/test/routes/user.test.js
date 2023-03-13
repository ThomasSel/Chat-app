const app = require("../../app");
const request = require("supertest");
const testHelpers = require("../testHelpers");
const User = require("../../models/user");

describe("User routes", () => {
  beforeAll(async () => {
    await testHelpers.connect();
  });

  afterAll(async () => {
    await testHelpers.disconnect();
  });

  beforeEach(async () => {
    await testHelpers.deleteCollection("users");
  });

  describe("when a valid user is provided", () => {
    let response;
    beforeEach(async () => {
      response = await request(app).post("/users").send({
        email: "test@test.com",
        username: "fakeUsername",
        password: "1234Password1234",
      });
    });

    it("responds with 201 status code", () => {
      expect(response.statusCode).toEqual(201);
    });

    it("responds with message", () => {
      expect(response.body.message).toEqual("User created");
    });

    it("creates a user with the given email", async () => {
      const newUser = await User.findOne();
      expect(newUser.email).toEqual("test@test.com");
    });

    it("creates a user with the given username", async () => {
      const newUser = await User.findOne();
      expect(newUser.username).toEqual("fakeUsername");
    });

    it("creates a user with the given password", async () => {
      const newUser = await User.findOne();
      expect(newUser.password).toEqual("1234Password1234");
    });
  });
});
