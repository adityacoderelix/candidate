import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { getCompanyDetails, createCompanyDetails, updateCompanyDetails } from "../controllers/companyController.js";

const router = express.Router();

router.get("/", authMiddleware, getCompanyDetails);
router.post("/", authMiddleware, createCompanyDetails);
router.put("/:id", authMiddleware, updateCompanyDetails);

export default router;