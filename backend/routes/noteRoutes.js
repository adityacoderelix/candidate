import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {  addNote, getNoteByCandidate } from "../controllers/noteController.js";

const router = express.Router();

router.post("/", authMiddleware, addNote);
router.get("/:id", authMiddleware, getNoteByCandidate);

export default router;