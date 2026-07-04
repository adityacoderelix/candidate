import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    title: String,
    department: String,
    openings: Number,
    jobDescription: String
});

export default mongoose.models.Job || mongoose.model("Job", jobSchema);