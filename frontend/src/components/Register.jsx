import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api"; // Import the registerUser function
import "./Register.css";

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // For success pop-up
    const [showPassword, setShowPassword] = useState(false); // To toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // To toggle confirm password visibility

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Frontend validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)) {
            setError("Invalid email format.");
            return;
        }

        try {
            const { data } = await registerUser(formData); // Make API call to register the user
            setSuccessMessage(data.message);
            setError(""); // Clear error message on successful registration

            // Hide the success message after 3 seconds
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>
                <span className="travel">Travel </span>
                <span className="friend">Friend</span>
            </h1>
            <h2 className="subheading">Create your free account here</h2>
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit(e);
                }}
            />
            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit(e);
                }}
            />
            <div className="password-container">
                <input
                    type={showPassword ? "text" : "password"} // Toggle visibility
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit(e);
                    }}
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
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSubmit(e);
                    }}
                />
                <span
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle password view
                >
                    {showConfirmPassword ? "👁️" : "👁‍🗨️"} {/* Eye icons */}
                </span>
            </div>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>} {/* Success message */}
            <button type="submit">Register</button>
            <p className="signup-link">
                Already have an account? <span onClick={() => navigate("/login")}>Log in here</span>
            </p>
            <div className="google-signin">
                <span>or continue with</span>
                <button className="google-button" onClick={() => { /* Handle Google Sign-In */ }}>
                    Sign in with Google
                </button>
            </div>
        </form>
    );
}

export default Register;
