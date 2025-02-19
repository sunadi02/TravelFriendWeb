import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageHotels.css";
import hotelPlaceholder from '../images/pp.png';

const ManageHotels = () => {
    const navigate = useNavigate();
    const [hotels, setHotels] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [editingHotel, setEditingHotel] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [newHotelImage, setNewHotelImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("hotel_name");

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/");
        }

        axios.get("http://localhost:5000/api/hotels")
            .then(response => setHotels(response.data.hotels))
            .catch(error => console.error("Error fetching hotels:", error));
    }, [navigate]);

    // Filtering logic
    const filteredHotels = hotels.filter(hotel => {
        const value = filterOption === "ratings"
            ? hotel[filterOption].toString()
            : hotel[filterOption]?.toLowerCase() || "";

        return value.includes(searchTerm.toLowerCase());
    });

    const toggleDropdown = (hotelId) => {
        setSelectedHotel(selectedHotel === hotelId ? null : hotelId);
    };

    const handleEdit = (hotel, e) => {
        e.stopPropagation();
        setEditingHotel(hotel);
        setPreviewImage(hotel.image || hotelPlaceholder);
        setShowEditPopup(true);
        setSelectedHotel(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewHotelImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleDelete = async (hotelId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this hotel?")) {
            try {
                await axios.delete(`http://localhost:5000/api/hotels/${hotelId}`);
                setHotels(hotels.filter(hotel => hotel.hotel_id !== hotelId));
                alert("Hotel deleted successfully!");
            } catch (error) {
                console.error("Error deleting hotel:", error);
                alert("Failed to delete hotel.");
            }
        }
    };

    const handleSaveChanges = async () => {
        const hotelData = new FormData();
        hotelData.append("hotel_name", editingHotel.hotel_name);
        hotelData.append("location", editingHotel.location);
        hotelData.append("price_range", editingHotel.price_range);
        hotelData.append("phone_number", editingHotel.phone_number);
        hotelData.append("description", editingHotel.description);
        hotelData.append("username", editingHotel.username);
        hotelData.append("email", editingHotel.email);
        hotelData.append("password", editingHotel.password);
        hotelData.append("ratings", editingHotel.ratings);
        hotelData.append("latitude", editingHotel.latitude);
        hotelData.append("longitude", editingHotel.longitude);

        if (newHotelImage) {
            hotelData.append("image", newHotelImage);
        }

        try {
            await axios.put(`http://localhost:5000/api/hotels/${editingHotel.hotel_id}`, hotelData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setHotels(hotels.map(hotel => hotel.hotel_id === editingHotel.hotel_id ? { ...editingHotel, image: previewImage } : hotel));
            setShowEditPopup(false);
            alert("Hotel updated successfully!");
        } catch (error) {
            console.error("Error updating hotel:", error);
            alert("Failed to update hotel.");
        }
    };

    return (
        <div className="manage-hotels">
            <div className="header-section">
                <h1>Manage Hotels</h1>
                <button className="add-hotel-btn" onClick={() => navigate("/add-hotel")}>
                    + Add New Hotel
                </button>
            </div>

            {/* Search and Filter */}
            <div className="search-filter">
                <input
                    type="text"
                    placeholder={`Search by ${filterOption.replace("_", " ")}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                    <option value="hotel_name">Hotel Name</option>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="location">Location</option>
                    <option value="ratings">Ratings</option>
                </select>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Hotel Name</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Location</th>
                        <th>Price Range (LKR)</th>
                        <th>Phone</th>
                        <th>Ratings</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredHotels.map((hotel) => (
                        <tr key={hotel.hotel_id} onClick={() => navigate(`/manage-rooms/${hotel.hotel_id}`)}>
                            <td>
                                <img src={hotel.image || hotelPlaceholder} alt="Hotel" className="hotel-pic" />
                            </td>
                            <td>{hotel.hotel_name}</td>
                            <td>{hotel.username}</td>
                            <td>{hotel.email}</td>
                            <td>{hotel.location}</td>
                            <td>{hotel.price_range}</td>
                            <td>{hotel.phone_number}</td>
                            <td>{hotel.ratings}</td>
                            <td>
                                <div className="action-menu">
                                    <button onClick={(e) => { e.stopPropagation(); toggleDropdown(hotel.hotel_id); }}>⋮</button>
                                    {selectedHotel === hotel.hotel_id && (
                                        <div className="dropdown">
                                            <button onClick={(e) => { e.stopPropagation(); handleEdit(hotel, e); }}>Edit</button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDelete(hotel.hotel_id, e); }}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditPopup && editingHotel && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Edit Hotel</h2>

                        <div className="profile-edit-section">
                            <label>Hotel Image:</label>
                            <img src={previewImage} alt="Hotel Preview" className="profile-preview" />
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>

                        <label>Hotel Name:</label>
                        <input type="text" value={editingHotel.hotel_name} onChange={(e) => setEditingHotel({ ...editingHotel, hotel_name: e.target.value })} />

                        <label>Location:</label>
                        <input type="text" value={editingHotel.location} onChange={(e) => setEditingHotel({ ...editingHotel, location: e.target.value })} />

                        <div className="popup-buttons">
                            <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
                            <button onClick={() => setShowEditPopup(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageHotels;
