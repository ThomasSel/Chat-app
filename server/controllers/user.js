const User = require("../models/user");

const UserController = {
  create: async (req, res) => {
    const { email, username, password } = req.body;
    const user = new User({
      email: email,
      username: username,
      password: password,
    });

    try {
      await user.save();
      res.status(201).json({ message: "User created" });
    } catch (error) {
      res.status(400).json({ message: "Error - Invalid details" });
    }
  },
};

module.exports = UserController;
