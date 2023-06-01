import express from "express";
import { generate } from "../controllers/REST/token";

const router = express.Router();

router.post("/", generate);

export default router;
