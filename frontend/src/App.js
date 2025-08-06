import React from "react";
import "./App.css";
import { Route, Routes, Navigate } from "react-router-dom";

import Login from "./Components/Login/Login";
import Fit from "./Components/Fit/Fit";
import ProtectedRoutes from "./ProtectedRoutes";
import ChangePassword from "./Components/Login/ChangePassword";
import ForgotPassword from "./Components/Login/ForgotPassword";
import Profile from "./Components/Login/Profile"; // ✅ New import

const App = () => {
    return (
        <>
            <Routes>
                {/* Redirect root to login */}
                <Route path="/" element={<Navigate to="/Login" />} />

                {/* Public Routes */}
                <Route path="/Login" element={<Login />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoutes />}>
                    <Route path="/Fit" element={<Fit />} />
                    <Route path="/profile" element={<Profile />} /> {/* ✅ New profile route */}
                </Route>
            </Routes>
        </>
    );
};

export default App;
