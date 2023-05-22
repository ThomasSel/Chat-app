import express from "express";
import cors from "cors";

import userRouter from "./routes/user";
import tokenRouter from "./routes/token";

const app = express();

app.use(cors({ origin: "http://localhost:3000", optionsSuccessStatus: 200 }));
app.use(express.json());

app.use("/users", userRouter);
app.use("/login", tokenRouter);

app.get("/status", (req, res) => {
  res.status(200).json({ status: "online" });
});

export default app;
