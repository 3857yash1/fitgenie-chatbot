import express from "express";
import User from "../model/User.js";

const router = express.Router();

// ✅ Update profile (PUT or POST)
router.post("/update-profile", async (req, res) => {
    const { username, email, mobile } = req.body;

    try {
        const user = await User.findOne({ Username: username });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.EmailID = email || user.EmailID;
        user.Mobile = mobile || user.Mobile;

        await user.save();
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
});

// ✅ Get profile info
router.get("/get-profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ Username: req.params.username });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({
            success: true,
            user: {
                Username: user.Username,
                EmailID: user.EmailID,
                Mobile: user.Mobile || ""
            }
        });
    } catch (err) {
        console.error("Error retrieving profile:", err);
        res.status(500).json({ success: false, message: "Error retrieving profile" });
    }
});

export default router;
