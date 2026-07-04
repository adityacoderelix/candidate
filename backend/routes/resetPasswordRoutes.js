import { forgotPassword, resetPassword } from "../controllers/passwordResetController.js";
import express from "express";

const router = express.Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;