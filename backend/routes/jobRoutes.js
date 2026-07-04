import express from "express";
import authMiddleware from "../middleware/authMiddleware.js"
import { getJobs, createJob, deleteJob, updateJob } from "../controllers/jobController.js";

const router = express.Router();

router.get('/public', getJobs);
router.get("/", authMiddleware, getJobs);
router.post("/", authMiddleware, createJob);
router.delete("/:id", authMiddleware, deleteJob);
router.put("/:id", authMiddleware, updateJob);

export default router;