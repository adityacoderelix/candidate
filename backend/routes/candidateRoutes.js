import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { getCandidates, createCandidate, updateCandidate, deleteCandidate, createCandidateByForm } from "../controllers/candidateController.js";

const router = express.Router();

router.get("/", authMiddleware, getCandidates);
router.delete("/:id", authMiddleware, deleteCandidate);
router.post('/apply', upload.fields([{ name: "resume", maxCount: 1}]), createCandidateByForm);

router.put("/:id", authMiddleware, upload.fields([ { name: "resume", maxCount: 1 },
    { name: "offerLetter", maxCount: 1 } ]), updateCandidate);

router.post("/", authMiddleware, upload.fields([ { name: "resume", maxCount: 1 },
    { name: "offerLetter", maxCount: 1 } ]), createCandidate);

export default router;