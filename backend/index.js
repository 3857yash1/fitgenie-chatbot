import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Import routes
import signup from "./Routes/Login.js";
import register from "./Routes/Register.js";
import chat from "./Routes/Chat.js";
import forgotPassword from "./Routes/ForgotPassword.js";
import profileRoutes from "./Routes/Profile.js"; // ✅ Profile route

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
(async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DB_NAME}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ Database Connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err.message);
    }
})();

// ✅ Routes
app.use("/SignIn", signup);
app.use("/Register", register);
app.use("/chat", chat);
app.use("/ForgotPassword", forgotPassword);
app.use("/", profileRoutes); // ✅ Use profile routes

// ✅ Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
