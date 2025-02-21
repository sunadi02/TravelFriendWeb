import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GuideBookings.css";

const GuideBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterBy, setFilterBy] = useState("user_name"); // Default filter: Traveller's Name

    useEffect(() => {
        const guideId = localStorage.getItem("guide_id"); 
        if (!guideId) {
            console.error("No guide ID found.");
            return;
        }

        axios.get(`http://localhost:5000/api/guide/bookings/${guideId}`)
            .then(response => setBookings(response.data.bookings))
            .catch(error => console.error("Error fetching bookings:", error));
    }, []);

    // Filter bookings based on search input and filterBy category
    const filteredBookings = bookings.filter((booking) => {
        const fieldToFilter = booking[filterBy] ? booking[filterBy].toString().toLowerCase() : "";
        return fieldToFilter.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="guide-bookings">
            <h1>My Bookings</h1>

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
                    <option value="total_price">Total Price</option>
                </select>
            </div>

            {/* Bookings Table */}
            <table>
                <thead>
                    <tr>
                        <th>Traveller's Name</th>
                        <th>Total Price (LKR)</th>
                        <th>Booking Date</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredBookings.length > 0 ? (
                        filteredBookings.map((booking) => (
                            <tr key={booking.booking_id}>
                                <td>{booking.user_name}</td>
                                <td>{booking.total_price.toLocaleString()}</td>
                                <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-results">No bookings found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GuideBookings;