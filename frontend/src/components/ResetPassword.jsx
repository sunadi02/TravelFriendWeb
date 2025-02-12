import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api"; // Import the resetPassword function
import "./ResetPassword.css";

function ResetPassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "", confirmPassword: "" });
    const [message, setMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // To toggle confirm password visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        try {
            const { data } = await resetPassword(formData); // Make API call to reset password
            setMessage(data.message);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setMessage("Failed to reset password.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>
                <span className="travel">Travel </span>
                <span className="friend">Friend</span>
            </h1>
            <h2 className="subheading">Reset Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
            />
            <input
                type="text"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                required
            />
            <div className="password-container">
                <input
                    type={showPassword ? "text" : "password"} // Toggle visibility
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                    required
                />
                <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)} // Toggle password view
                >
                    {showPassword ? "👁️" : "👁‍🗨️"} {/* Eye icons */}
                </span>
            </div>
            <div className="password-container">
                <input
                    type={showConfirmPassword ? "text" : "password"} // Toggle visibility
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                />
                <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle password view
                >
                    {showConfirmPassword ? "👁️" : "👁‍🗨️"} {/* Eye icons */}
                </span>
            </div>
            {message && <p className="message">{message}</p>}
            <button type="submit">Reset Password</button>
        </form>
    );
}

export default ResetPassword;
