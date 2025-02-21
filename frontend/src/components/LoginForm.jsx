import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import axios from "axios";

function LoginForm({ setLoggedIn, setIsAdmin, setIsGuide, setIsHotel }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });

    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const adminResponse = await axios.post("http://localhost:5000/api/admin/login", formData);
            if (adminResponse.data.admin) {
                localStorage.setItem("token", adminResponse.data.token);
                localStorage.setItem("isAdmin", "true");
                setIsAdmin(true);
                setLoggedIn(true);
                setSuccessMessage("Logged in successfully as Admin!");
                navigate("/admin-dashboard");
                return;
            }
        } catch (adminError) {
            console.log("Admin login failed, trying guide login...");
        }

        try {
            const guideResponse = await axios.post("http://localhost:5000/api/guide/login", formData);
            if (guideResponse.data.guide) {
                localStorage.setItem("token", guideResponse.data.token);
                localStorage.setItem("role", "guide");
                localStorage.setItem("guide_id", guideResponse.data.guide.id);  // Store guide_id
                setIsAdmin(false);
                setIsGuide(true);  // ✅ Set guide status
                setLoggedIn(true);
                setSuccessMessage("Logged in successfully as Guide!");
                navigate("/guide-dashboard");
                return;
            }
        } catch (guideError) {
            console.log("Guide login failed, trying hotel login...");
        }

        try {
            const hotelResponse = await axios.post("http://localhost:5000/api/hotel/login", formData);
            if (hotelResponse.data.hotel) {
                localStorage.setItem("token", hotelResponse.data.token);
                localStorage.setItem("role", "hotel");
                setIsGuide(false);
                setIsHotel(true);  // ✅ Set hotel status
                setLoggedIn(true);
                setSuccessMessage("Logged in successfully as Hotel!");
                navigate("/hotel-dashboard");
                return;
            }
        } catch (hotelError) {
            console.log("Hotel login failed, trying user login...");
        }
        

        try {
            const userResponse = await axios.post("http://localhost:5000/api/user/login", formData);
            localStorage.setItem("token", userResponse.data.token);
            localStorage.setItem("isAdmin", "false");
            setIsHotel(false);
            setIsAdmin(false);
            setIsGuide(false);
            setLoggedIn(true);
            setSuccessMessage("Logged in successfully!");
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
