import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // Import API service
import "./LoginForm.css";

function LoginForm({ setLoggedIn }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // For success pop-up
    const [showPassword, setShowPassword] = useState(false); // To toggle password visibility

    // Hardcoded admin credentials
    const ADMIN_CREDENTIALS = { username: "admin", password: "admin123" };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // First, check if the user is an admin
        if (
            formData.username === ADMIN_CREDENTIALS.username &&
            formData.password === ADMIN_CREDENTIALS.password
        ) {
            // Save admin session
            localStorage.setItem("isAdmin", "true");
    
            setSuccessMessage("Logged in successfully as Admin!");
            setError("");
            setLoggedIn(true);
    
            navigate("/admin-dashboard"); // Redirect to Admin Dashboard
    
            setTimeout(() => setSuccessMessage(""), 3000);
            return; // Important: Stop further execution
        }
    
        try {
            const { data } = await loginUser(formData);
    
            // Save token & user ID in localStorage
            localStorage.setItem("token", data.token);
            localStorage.setItem("user_id", data.user.id);
            localStorage.setItem("isAdmin", "false"); // Mark as regular user
    
            console.log("User ID saved:", data.user.id); // Debugging check
    
            setSuccessMessage("Logged in successfully!");
            setError(""); 
            setLoggedIn(true);
    
            navigate("/"); // Redirect to homepage
    
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <h1>
                <span className="travel">Travel </span>
                <span className="friend">Friend</span>
            </h1>
            <h2 className="subheading">Log in to your account</h2>
            <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
            />
            <div className="password-container">
                <input
                    type={showPassword ? "text" : "password"} // Toggle visibility
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(e); }}
                />
                <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)} 
                >
                    {showPassword ? "👁️" : "👁‍🗨️"} {/* Eye icons */}
                </span>
            </div>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>} {/* Success message */}
            <button type="submit">Log In</button>
            <p className="signup-link">
                Don't have an account? <span onClick={() => navigate("/register")}>Sign Up</span>
            </p>
            <p className="forgot-password">
                Forgot Password? <span onClick={() => navigate("/forgot-password")}>Click here</span>
            </p>
        </form>
    );
}

export default LoginForm;
