import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddGuideForm.css";

const AddGuideForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        guide_name: "",
        phone_number: "",
        languages: "",
        hourly_rate: "",
        rating: 5,
        description: "",
    });
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setProfilePic(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.email || !formData.password || !formData.guide_name || !formData.phone_number) {
            setError("Please fill in all required fields.");
            return;
        }

        const guideData = new FormData();
        Object.keys(formData).forEach((key) => {
            guideData.append(key, formData[key]);
        });
        if (profilePic) {
            guideData.append("profile_pic", profilePic);
        }

        try {
            await axios.post("http://localhost:5000/api/guides", guideData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage("Guide added successfully!");
            setTimeout(() => navigate("/manage-guides"), 2000);
        } catch (error) {
            setError("Failed to add guide. Please try again.");
            console.error("Error adding guide:", error);
        }
    };

    return (
        <div className="add-guide-container">
            <h2>Add New Guide</h2>
            <form onSubmit={handleSubmit} className="add-guide-form">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="text" name="guide_name" placeholder="Guide Name" value={formData.guide_name} onChange={handleChange} required />
                <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
                <input type="text" name="languages" placeholder="Languages (e.g., English, French)" value={formData.languages} onChange={handleChange} />
                <input type="number" name="hourly_rate" placeholder="Daily Rate (LKR)" value={formData.hourly_rate} onChange={handleChange} />
                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>

                <label className="upload-label">
                    Upload Profile Picture:
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>

                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <div className="buttons">
                    <button type="submit">Add Guide</button>
                    <button type="button" onClick={() => navigate("/manage-guides")}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default AddGuideForm;
