import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";

import { updateProfile, register, login, getUsers, resetPassword as adminResetPassword, checkEmail, deleteUser, getHrAndAdminUsers, approveUser, approveUserFromEmail } from "../controllers/authController.js";

const router = express.Router();

router.put("/update-profile/:id", updateProfile);
router.post("/check-email", checkEmail); 
router.post('/register', register);
router.post('/login', login);
router.get('/users', authMiddleware, getUsers);
router.put('/reset-user-password/:id', authMiddleware, adminResetPassword);
router.delete('/delete-user/:id',authMiddleware, deleteUser);
router.get('/users-list', authMiddleware, getHrAndAdminUsers);
router.put('/approve-user/:id', authMiddleware, approveUser);
router.get('/approve-user-link/:id', approveUserFromEmail);

export default router;