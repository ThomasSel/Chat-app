const User = require("../../models/user");
const testHelpers = require("../testHelpers");

describe(User, () => {
  beforeAll(async () => {
    await testHelpers.connect();
  });

  afterAll(async () => {
    await testHelpers.disconnect();
  });

  beforeEach(async () => {
    await testHelpers.deleteCollection("users");
  });

  describe("with a valid user", () => {
    let user;
    beforeEach(() => {
      user = new User({
        email: "test@test.com",
        username: "testUsername",
        password: "1234Password1234",
      });
    });

    it("has an email", () => {
      expect(user.email).toEqual("test@test.com");
    });

    it("has a username", () => {
      expect(user.username).toEqual("testUsername");
    });

    it("has a password", () => {
      expect(user.password).toEqual("1234Password1234");
    });

    it("has an id", () => {
      expect(user.id).toEqual(expect.any(String));
    });

    it("can be saved with an email and password", async () => {
      await user.save();

      const savedUser = await User.findById(user._id);
      expect(savedUser.email).toEqual("test@test.com");
      expect(savedUser.username).toEqual("testUsername");
      expect(savedUser.password).toEqual("1234Password1234");
    });
  });

  describe("field validation", () => {
    it("cannot be saved when given an empty email", async () => {
      const user = new User({
        username: "testUsername",
        password: "1234Password1234",
      });

      await expect(user.save()).rejects.toThrow(
        "User validation failed: email"
      );
    });

    it("cannot be saved when given an invalid email", async () => {
      const user = new User({
        email: "asdjhflaksjdhflaksd",
        username: "testUsername",
        password: "1234Password1234",
      });

      await expect(user.save()).rejects.toThrow(
        "User validation failed: email"
      );
    });

    // We should test that duplicate emails aren't added
    // but mongoose indices make this difficult and these have
    // been omitted for time

    it("cannot be saved when given an empty username", async () => {
      const user = new User({
        email: "test@test.com",
        password: "1234Password1234",
      });

      await expect(user.save()).rejects.toThrow(
        "User validation failed: username"
      );
    });

    it("cannot be saved when username is less than 4 characters long", async () => {
      const user1 = new User({
        email: "test@test.com",
        username: "123",
        password: "1234Password1234",
      });
      const user2 = new User({
        email: "test@test.com",
        username: "1234",
        password: "1234Password1234",
      });

      await Promise.all([
        expect(user1.save()).rejects.toThrow(),
        expect(user2.save()).resolves,
      ]);
    });

    it("cannot be saved when given an empty password", async () => {
      const user = new User({
        email: "test@test.com",
        username: "testUsername",
      });

      await expect(user.save()).rejects.toThrow(
        "User validation failed: password"
      );
    });

    it("cannot be saved when password is less than 6 characters long", async () => {
      const user1 = new User({
        email: "test@test.com",
        username: "testUsername",
        password: "1234",
      });
      const user2 = new User({
        email: "test@test.com",
        username: "testUsername",
        password: "12345",
      });
      const user3 = new User({
        email: "test@test.com",
        username: "testUsername",
        password: "123456",
      });

      await Promise.all([
        expect(user1.save()).rejects.toThrow(),
        expect(user2.save()).rejects.toThrow(),
        expect(user3.save()).resolves,
      ]);
    });
  });
});
