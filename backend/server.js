import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import resetPasswordRoutes from "./routes/resetPasswordRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import logger from "./middleware/logMiddleware.js";

const app = express();

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:3000"
];

app.use(cors({
    origin: function (origin, callback) {

        if (!origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    methods: [
        "GET",
        "POST",
        "PUT",
        "DELETE",
        "PATCH",
        "OPTIONS"
    ],
    allowedHeaders: [
        "Content-Type",
        "Authorization"
    ],
    credentials: true
}));

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

app.use("/uploads", express.static("uploads"));

console.log("FRONTEND_URL =", process.env.FRONTEND_URL);
console.log("Mongo URI exists:", !!process.env.MONGO_URI);
console.log(
    "Mongo URI starts with:",
    process.env.MONGO_URI?.substring(0, 20)
);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MONGODB CONNECTED");
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED");
    console.error(err);
});

app.get("/", (req,res) => {
    res.send("Root route");
});

app.use(logger);

app.use("/auth", authRoutes);
app.use("/candidates", candidateRoutes);
app.use("/jobs", jobRoutes);
app.use("/notes", noteRoutes);
app.use("/auth", resetPasswordRoutes);
app.use("/company-details", companyRoutes);

app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err);

    res.status(500).json({
        error: err.message
    });
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});