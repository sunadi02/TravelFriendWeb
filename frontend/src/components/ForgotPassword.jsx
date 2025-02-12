import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/api"; // Import the forgotPassword function
import "./ForgotPassword.css";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await forgotPassword({ email }); // Make API call to send OTP
            setMessage(data.message);
            setTimeout(() => navigate("/reset-password"), 3000);
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to send OTP.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>
                <span className="travel">Travel </span>
                <span className="friend">Friend</span>
            </h1>
            <h2 className="subheading">Forgot Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            {message && <p className="message">{message}</p>}
            <button type="submit">Send OTP</button>
        </form>
    );
}

export default ForgotPassword;
