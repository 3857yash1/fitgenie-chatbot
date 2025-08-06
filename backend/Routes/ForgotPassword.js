import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../model/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-strong-secret-key";

// ✅ Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,       // e.g., your Gmail address
        pass: process.env.EMAIL_PASSWORD    // Gmail App Password (not regular password!)
    }
});

// ✅ Forgot Password: Send Reset Email
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ EmailID: email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const secret = JWT_SECRET + user.Password;
        const token = jwt.sign(
            { id: user._id, email: user.EmailID },
            secret,
            { expiresIn: "15m" }
        );

        const link = `http://localhost:3000/reset-password/${user._id}/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.EmailID,
            subject: "Reset Your Password",
            html: `<p>Click <a href="${link}">here</a> to reset your password. This link is valid for 15 minutes.</p>`,
        });

        res.status(200).json({ message: "Reset link sent to your email." });
    } catch (err) {
        console.error("Error in forgot-password:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Reset Password: Handle Password Update
router.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const secret = JWT_SECRET + user.Password;
        jwt.verify(token, secret);

        const hashed = await bcrypt.hash(password, 10);
        await User.updateOne({ _id: id }, { $set: { Password: hashed } });

        res.status(200).json({ message: "Password reset successful!" });
    } catch (err) {
        console.error("Error in reset-password:", err);
        res.status(400).json({ message: "Invalid or expired token" });
    }
});

export default router;
