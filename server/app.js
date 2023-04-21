const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");

const userRouter = require("./routes/user");
const tokenRouter = require("./routes/token");

const app = express();

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(express.json());

app.use("/users", userRouter);
app.use("/login", tokenRouter);
app.get("/status", (req, res) => {
  res.status(200).json({ status: "online" });
});

module.exports = app;
