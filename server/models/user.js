const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    unique: true,
    dropDups: true,
  },
  password: { type: String, required: true, minLength: 6 },
});

const User = new mongoose.model("User", UserSchema);

module.exports = User;
