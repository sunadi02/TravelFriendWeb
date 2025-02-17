import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddHotelForm.css";

const AddHotelForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        hotel_name: "",
        location: "",
        price_range: "",
        phone_number: "",
        description: "",
    });
    const [hotelImage, setHotelImage] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleCancel = () => {
        navigate(-1); // Go back to the previous page
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setHotelImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.username || !formData.email || !formData.password || !formData.hotel_name || !formData.description || !formData.location || !formData.price_range || !formData.phone_number) {
            setError("Please fill in all required fields.");
            return;
        }

        const hotelData = new FormData();
        Object.keys(formData).forEach((key) => {
            hotelData.append(key, formData[key]);
        });
        if (hotelImage) {
            hotelData.append("image", hotelImage);
        }

        try {
            await axios.post("http://localhost:5000/api/hotels", hotelData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setSuccessMessage("Hotel added successfully!");
            setTimeout(() => navigate("/manage-hotels"), 2000);
        } catch (error) {
            setError("Failed to add hotel. Please try again.");
            console.error("Error adding hotel:", error);
        }
    };

    return (
        <div className="add-hotel-container">
            <h2>Add New Hotel</h2>
            <form onSubmit={handleSubmit} className="add-hotel-form">
                <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                <input type="text" name="hotel_name" placeholder="Hotel Name" value={formData.hotel_name} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
                <input type="text" name="price_range" placeholder="Price Range" value={formData.price_range} onChange={handleChange} required />
                <input type="text" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
                
                <textarea name="description" placeholder="Hotel Description" value={formData.description} onChange={handleChange} required></textarea>

                <label className="upload-label">
                    Upload Hotel Image:
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>

                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}

                <button type="submit">Add Hotel</button>
                <button className="cancel-btn" type="button" onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default AddHotelForm;
