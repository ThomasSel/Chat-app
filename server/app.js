const express = require("express");
const cors = require("cors");

const User = require("./models/user");
const userRouter = require("./routes/user");

const app = express();

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(express.json());

app.use("/users", userRouter);

module.exports = app;
