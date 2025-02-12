import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./LoginForm.css";
import axios from "axios";

function LoginForm({ setLoggedIn }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // First, try admin login
            const adminResponse = await axios.post("http://localhost:5000/api/admin/login", formData);
            if (adminResponse.data.success) {
                localStorage.setItem("isAdmin", "true");
                setSuccessMessage("Logged in successfully as Admin!");
                setLoggedIn(true);
                navigate("/admin-dashboard");
                return;
            }
        } catch (adminError) {
            console.log("Admin login failed, trying user login...");
        }

        try {
            // If not admin, try user login
            const userResponse = await axios.post("http://localhost:5000/api/user/login", formData);
            localStorage.setItem("token", userResponse.data.token);
            localStorage.setItem("user_id", userResponse.data.user.id);
            localStorage.setItem("isAdmin", "false");

            setSuccessMessage("Logged in successfully!");
            setLoggedIn(true);
            navigate("/");
        } catch (userError) {
            setError("Invalid credentials!");
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
            />
            <div className="password-container">
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "👁️" : "👁‍🗨️"}
                </span>
            </div>
            {error && <p className="error">{error}</p>}
            {successMessage && <p className="success">{successMessage}</p>}
            <button type="submit">Log In</button>
        </form>
    );
}

export default LoginForm;
