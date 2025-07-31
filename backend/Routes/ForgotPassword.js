import express from "express";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

// 📨 Route 1: Forgot password — send email
router.post("/", async (req, res) => {
    const { EmailID } = req.body;

    try {
        const user = await User.findOne({ EmailID });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const mailOptions = {
            from: process.env.MAIL_USER,
            to: EmailID,
            subject: "FitGenie – Password Reset Request",
            text: `Hi ${user.Username},\n\nYou requested a password reset.\n\nClick the link below to reset your password:\n\nhttp://localhost:3000/reset-password/${user._id}\n\n(This is a demo reset link)\n\n- FitGenie Team`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset link sent to your email." });
    } catch (error) {
        console.error("Error sending reset email:", error);
        res.status(500).json({ message: "Something went wrong. Try again later." });
    }
});

// 🔐 Route 2: Change password securely using bcrypt
router.post("/ChangePassword", async (req, res) => {
    const { username, password, newPassword } = req.body;

    try {
        const user = await User.findOne({ Username: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect current password" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.Password = hashedNewPassword;
        await user.save();

        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
