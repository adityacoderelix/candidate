import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema({
    candidateId: String,
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    experience: String,
    qualification: String,
    coverLetter: String,
    previousEmployment: String,
    status: {
        type: String,
        enum: ["New Application", "Shortlisted", "Screening Call", "Interview Scheduled", "In-Person Interview",
            "Rejected", "Offered", "Negotiation", "Blacklisted", "Cooling Period", "Offer Accepted", "Offer Rejected"
        ],
        default: "New Application"
    },
    noticePeriod: String,
    currentSalary: String,
    expectedSalary: String,
    extraInfo: {
        type: String,
        default: ""
    },
    interviewDate: String,
    interviewTime: String,
    interviewLocation: String,
    aptitudeScore: {
        type: Number,
        min: 1,
        max: 30
    },
    skillRating: {
        type: Number,
        min: 1,
        max: 10
    },
    coolingPeriodStart: Date,
    coolingPeriodEnd: Date,
    resume: String,
    offerLetter: String,
    recipients: [{
        name: String,
        email: String
    }],
    changeLogs: [{
        field: String,
        oldValue: String,
        newValue: String,
        changedBy: String,
        changedAt: {
            type: Date,
            default: Date.now
        }
    }],
    jobRole: {
        type: String,
        default: ""
    },
    applicationDate: {
        type: Date,
        default: Date.now
    },
    conductRecords: [
        {
            stage: {
                type: String,
                required: true
            },
            round: {
                type: String,
                default: ""
            },
            conduct: {
                type: String,
                enum: ["Good", "Average", "Bad"],
                required: true
            },
            createdBy: {
                type: String,
                default: "Unknown User"
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    interviewRounds: [
    {
        round: {
            type: String,
            enum: ["Round 1", "Round 2", "Round 3", "Round 4"],
            required: true
        },
        createdBy: {
            type: String,
            default: "Unknown User"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
    ],
    ratingRecords: [
    {
        stage: String,
        rating: Number
    }
    ]
}, { timestamps: true });

export default mongoose.models.Candidate || mongoose.model("Candidate", candidateSchema);