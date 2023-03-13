const User = require("../models/user");
const jwt = require("jsonwebtoken");

const TokenController = {
  generate: (req, res) => {
    res.status(200).json({ message: "success" });
  },
};

module.exports = TokenController;
