import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    role: {
        type: String,
        enum: ["Admin", "HR"]
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    isApproved: {
        type: Boolean,
        default: false
    }
})

export default mongoose.models.User || mongoose.model("User", userSchema);