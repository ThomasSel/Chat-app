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
});
