import express from "express";
import { getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/send/:id", sendMessage);
router.get("/:id", getMessages);

export default router;
