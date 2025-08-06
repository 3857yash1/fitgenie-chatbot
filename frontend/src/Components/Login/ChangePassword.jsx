import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import this
import "./ChangePassword.css";

const ChangePassword = () => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate(); // 👈 Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = localStorage.getItem("Username");
        try {
            const response = await fetch("http://localhost:5000/ChangePassword", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, newPassword })
            });

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage("Error changing password");
        }
    };

    return (
        <div className="change-password-container">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Current Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <button type="submit">Change Password</button>
            </form>

            {/* ✅ Back to Home button */}
            <button
                onClick={() => navigate("/")}
                className="back-home-button"
            >
                Back to Home
            </button>

            {message && <p>{message}</p>}
        </div>
    );
};

export default ChangePassword;
