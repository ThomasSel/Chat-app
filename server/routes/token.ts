import express from "express";
import { generate } from "../controllers/token";

const router = express.Router();

router.post("/", generate);

export default router;
