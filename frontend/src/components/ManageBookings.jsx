import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageBookings.css"; // Create this CSS file

const ManageBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("user_name"); // Default filter: Traveller's Name

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/"); // Redirect non-admin users
        }

        axios.get("http://localhost:5000/api/bookings")
            .then(response => setBookings(response.data.bookings))
            .catch(error => console.error("Error fetching bookings:", error));
    }, [navigate]);

    // Filter bookings based on search input and filterBy category
    const filteredBookings = bookings.filter((booking) => {
        const fieldToFilter = booking[filterBy] ? booking[filterBy].toString().toLowerCase() : "";
        return fieldToFilter.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="manage-bookings">
            <h1>Manage Bookings</h1>

            {/* Search and Filter Section */}
            <div className="search-filter-container">
                <input
                    type="text"
                    placeholder={`Search by ${filterBy.replace("_", " ")}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-bar"
                />

                <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="filter-dropdown">
                    <option value="user_name">Traveller's Name</option>
                    <option value="hotel_name">Hotel Name</option>
                    <option value="guide_name">Guide Name</option>
                    <option value="room_type">Room Type</option>
                </select>
            </div>

            {/* Bookings Table */}
            <table>
                <thead>
                    <tr>
                        <th>Traveller's Name</th>
                        <th>Hotel/Guide Name</th>
                        <th>Room Type</th>
                        <th>Total Price (LKR)</th>
                        <th>Booking Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <tr key={booking.booking_id}>
                                <td>{booking.user_name}</td>
                                <td>{booking.hotel_name || booking.guide_name || "N/A"}</td>
                                <td>{booking.room_type || "N/A"}</td>
                                <td>{booking.total_price.toLocaleString()}</td>
                                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="no-results">No bookings found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBookings;
