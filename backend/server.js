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

const allowedOrigins = [process.env.FRONTEND_URL, "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
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
    error: err.message,
  });
});

let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;
    console.log("MONGODB CONNECTED");
  } catch (err) {
    console.error("MONGODB CONNECTION FAILED");
    throw err;
  }
}

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
