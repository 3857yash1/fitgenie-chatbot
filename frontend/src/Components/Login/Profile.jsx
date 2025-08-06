import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate();
    const storedUsername = localStorage.getItem("Username") || "";

    const [username, setUsername] = useState(storedUsername);
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!username) {
            setMessage("❌ No user logged in.");
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`http://localhost:5000/get-profile/${username}`);
                const data = await res.json();
                if (res.ok && data.success) {
                    setEmail(data.user.EmailID || "");
                    setMobile(data.user.Mobile || "");
                    setMessage("");
                } else {
                    setMessage("❌ Failed to load profile.");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setMessage("❌ Server error while fetching profile.");
            }
        };

        fetchProfile();
    }, [username]);

    const handleSave = async () => {
        if (!email || !mobile) {
            setMessage("❌ Email and mobile must not be empty.");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/update-profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, mobile }),
            });

            const data = await res.json();
            if (res.ok && data.success) {
                setMessage("✅ Profile updated successfully!");
                setIsEditing(false);
            } else {
                setMessage(`❌ ${data.message || "Failed to update profile"}`);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setMessage("❌ Server error while updating profile.");
        }
    };

    return (
        <div className="profile-container">
            <h2>👤 Profile Info</h2>

            <div className="profile-field">
                <label>Username:</label>
                <span>{username}</span>
            </div>

            <div className="profile-field">
                <label>Email:</label>
                {isEditing ? (
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                ) : (
                    <span>{email || "Not Available"}</span>
                )}
            </div>

            <div className="profile-field">
                <label>Mobile Number:</label>
                {isEditing ? (
                    <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Enter your mobile number"
                    />
                ) : (
                    <span>{mobile || "Not Available"}</span>
                )}
            </div>

            <div className="profile-buttons">
                {isEditing ? (
                    <button className="save-btn" onClick={handleSave}>Save</button>
                ) : (
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit</button>
                )}

                <button className="home-btn" onClick={() => navigate("/Fit")}>← Back to Home</button>
            </div>

            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default Profile;
