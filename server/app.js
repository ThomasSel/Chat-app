const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");

const User = require("./models/user");
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
app.get("/throw", (req, res) => {
  throw new Error("Thrown from the GET /throw endpoint");
  res.status(200).send("Success");
});

//Error handler that writes errors to file
app.use(async (err, req, res, next) => {
  console.log("EXPRESS ERROR HANDLER");
  try {
    await fs.writeFile("./server-error.log", err.stack);
    next(err);
  } catch (writeErr) {
    console.log("Error in the writeFile section");
    res.status(500).send("Server Error");
  }
});

module.exports = app;
