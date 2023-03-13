const app = require("../../app");
const request = require("supertest");
const testHelpers = require("../testHelpers");
const User = require("../../models/user");

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
    let response;
    beforeAll(async () => {
      response = await request(app)
        .post("/login")
        .send({ email: "test@test.com", password: "1234Password1234" });
    });

    it("responds with 200 status code", () => {
      expect(response.statusCode).toEqual(200);
    });

    it("responds with a message", () => {
      expect(response.body.message).toEqual("success");
    });
  });
});
