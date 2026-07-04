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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

mongoose.connect("mongodb://127.0.0.1:27017/cms")
.then(() => {console.log('MONGODB CONNECTED')})
.catch((err) => {console.log('MONGODB CONNECTION FAILED')});

app.use(logger);

app.use("/auth", authRoutes);
app.use("/candidates", candidateRoutes);
app.use("/jobs", jobRoutes);
app.use("/notes", noteRoutes);
app.use("/auth", resetPasswordRoutes);
app.use("/company-details", companyRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});