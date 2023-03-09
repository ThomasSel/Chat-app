const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(express.json());

app.get("/greet", (req, res) => {
  res.status(200).json({ message: "Hello world!" });
});

module.exports = app;
