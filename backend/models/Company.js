import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    companyName: String,
    companyPhone: String,
    companyEmail: String,
    companyAddress: String
}, { timestamps: true });

export default mongoose.model("Company", companySchema);