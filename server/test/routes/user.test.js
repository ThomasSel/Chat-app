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

  describe("when a valid user is provided", () => {
    let response, newUser;
    beforeAll(async () => {
      await testHelpers.deleteCollection("users");
      response = await request(app).post("/users").send({
        email: "test@test.com",
        username: "fakeUsername",
        password: "1234Password1234",
      });
      newUser = await User.findOne();
    });

    it("responds with 201 status code", () => {
      expect(response.statusCode).toEqual(201);
    });

    it("responds with message", () => {
      expect(response.body.message).toEqual("User created");
    });

    it("saves a user with the given email", async () => {
      expect(newUser.email).toEqual("test@test.com");
    });

    it("saves a user with the given username", async () => {
      expect(newUser.username).toEqual("fakeUsername");
    });

    it("saves a user with the given password", async () => {
      expect(newUser.password).toEqual("1234Password1234");
    });
  });

  describe("when an invalid user is provided", () => {
    let response;
    beforeAll(async () => {
      await testHelpers.deleteCollection("users");
      response = await request(app).post("/users").send({
        email: "",
        username: "",
        password: "",
      });
    });

    it("responds with a 400 status code", () => {
      expect(response.statusCode).toEqual(400);
    });

    it("responds with message", () => {
      expect(response.body.message).toEqual("Error - Invalid details");
    });

    it("doesn't add any users to the collection", async () => {
      const users = await User.find();
      expect(users.length).toEqual(0);
    });
  });
});
