import crypto from "crypto";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export const forgotPassword = async(req,res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({ message: "Email does not exist" });
        }

        if (user.role?.toLowerCase() !== "admin") {
            return res.status(403).json({message: "Only Admin users can reset password"});
        }

        const token = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

        await sendEmail({
            to: user.email,
            subject: "Reset your password",
            html: `
                <h2>Password Reset Request</h2>
                <p>Click the button below to reset your password.</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link expires in 15 minutes.</p>
            `
        });

        res.json({ message: "Password reset email sent" });

    } catch (err) {
        console.log("Forgot password error:", err);
        res.status(500).json({ message: err.message });
    }
};

export const resetPassword = async(req,res) => {
    try {
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Password reset successful" });
        
    } catch (err) {
        console.log("Forgot password error:", err);
        res.status(500).json({ message: err.message });
    }
};