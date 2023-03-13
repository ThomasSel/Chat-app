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

  describe("when given a valid email and password", () => {
    it("has an email", () => {
      const user = new User({
        email: "test@test.com",
        password: "1234Password1234",
      });
      expect(user.email).toEqual("test@test.com");
    });

    it("has a password", () => {
      const user = new User({
        email: "test@test.com",
        password: "1234Password1234",
      });
      expect(user.password).toEqual("1234Password1234");
    });

    it("has an id", () => {
      const user = new User({
        email: "test@test.com",
        password: "1234Password1234",
      });
      expect(user.id).toEqual(expect.any(String));
    });

    it("can be saved with an email and password", async () => {
      const user = new User({
        email: "test@test.com",
        password: "1234Password1234",
      });
      await user.save();

      const savedUser = await User.findById(user._id);
      expect(savedUser.email).toEqual("test@test.com");
      expect(savedUser.password).toEqual("1234Password1234");
    });
  });

  describe("field validation", () => {
    it("cannot be saved when given an empty email", async () => {
      const user = new User({ password: "1234Password1234" });
      await expect(user.save()).rejects.toThrow(
        "User validation failed: email"
      );
    });

    it("cannot be saved when given an invalid email", async () => {
      const user = new User({
        email: "asdjhflaksjdhflaksd",
        password: "1234Password1234",
      });
      await expect(user.save()).rejects.toThrow(
        "User validation failed: email"
      );
    });

    // We should test that duplicate emails aren't added
    // but mongoose indices make this difficult and these have
    // been omitted for time

    it("cannot be saved when given an empty password", async () => {
      const user = new User({ email: "test@test.com" });
      await expect(user.save()).rejects.toThrow(
        "User validation failed: password"
      );
    });

    it("cannot be saved when password is less that 6 characters long", async () => {
      const user1 = new User({ email: "test@test.com", password: "1234" });
      const user2 = new User({ email: "test@test.com", password: "12345" });
      const user3 = new User({ email: "test@test.com", password: "123456" });

      await Promise.all([
        expect(user1.save()).rejects.toThrow(),
        expect(user2.save()).rejects.toThrow(),
        expect(user3.save()).resolves,
      ]);
    });
  });
});
