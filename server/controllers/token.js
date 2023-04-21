const User = require("../models/user");
const jwt = require("jsonwebtoken");

const TokenController = {
  generate: async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).json({ message: "Bad request" });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ message: "Invalid details" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        iat: Math.floor(Date.now() / 1000),
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({ message: "success", token: token });
  },
};

module.exports = TokenController;
