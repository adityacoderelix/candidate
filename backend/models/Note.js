import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    note: {
        type: String,
        default: ""
    },

    createdBy: {
        type: String,
        default: ""
    },

    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Candidate",
        required: true
    },

    status: {
        type: String,
        enum: [
            "New Application",
            "Shortlisted",
            "Screening Call",
            "Interview Scheduled",
            "In-Person Interview",
            "Rejected",
            "Offered",
            "Negotiation",
            "Blacklisted",
            "Cooling Period",
            "Offer Accepted",
            "Offer Rejected"
        ]
    }
}, { timestamps: true });

export default mongoose.model("Note", noteSchema);