require("dotenv").config();

const http = require("http");
const mongoose = require("mongoose");
const app = require("./app");

const mongoURL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/chatApp";
mongoose.connect(mongoURL);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const port = parseInt(process.env.PORT || "8000");
const httpServer = http.createServer(app);

process.on("uncaughtException", (error) =>
  console.error(`SERVER ERROR - ${error}`)
);

httpServer.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
