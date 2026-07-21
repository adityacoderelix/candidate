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

app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:3000"],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

console.log("Mongo URI exists:", !!process.env.MONGO_URI);
console.log("Mongo URI starts with:", process.env.MONGO_URI?.substring(0, 20));
mongoose.connect(process.env.MONGO_URI)
.then(() => {console.log('MONGODB CONNECTED')})
.catch((err) => {
  console.log('MONGODB CONNECTION FAILED');
  console.error(err);
});

app.get('/', (req,res) => {
  res.send("Root route");
})

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