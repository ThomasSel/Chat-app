const express = require("express");
const cors = require("cors");
const User = require("./models/user");

const app = express();

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(express.json());

app.get("/greet", (req, res) => {
  res.status(200).json({ message: "Hello world!" });
});

let count = 0;
app.post("/users", (req, res) => {
  const user = new User({
    email: "test@test.com",
    password: `${count}Password${count}`,
  });

  user
    .save()
    .then(() => console.log("Success"))
    .catch(console.error)
    .then(() => res.status(201).send({ message: "Success" }));
});

module.exports = app;
