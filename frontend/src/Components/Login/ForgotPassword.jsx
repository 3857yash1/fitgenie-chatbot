import React, { useState } from 'react';
import './ForgotPassword.css';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Add axios

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
            setMessage(response.data.message); // Show success message
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className="forgot-password-container">
            <form onSubmit={handleSubmit} className="forgot-password-card">
                <h2>Forgot Password</h2>
                <label htmlFor="email">Registered Email</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>

                {message && <p style={{ color: 'green' }}>{message}</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Link to="/Login" className="back-to-login">Back to Login</Link>
            </form>
        </div>
    );
};

export default ForgotPassword;
