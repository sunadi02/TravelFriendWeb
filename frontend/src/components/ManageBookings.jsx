import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageBookings.css"; // Create this CSS file

const ManageBookings = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/"); // Redirect non-admin users
        }

        axios.get("http://localhost:5000/api/bookings")
            .then(response => setBookings(response.data.bookings))
            .catch(error => console.error("Error fetching bookings:", error));
    }, [navigate]);

    return (
        <div className="manage-bookings">
            <h1>Manage Bookings</h1>
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
                    {bookings.map((booking) => (
                        <tr key={booking.booking_id}>
                            <td>{booking.user_name}</td> {/* Replace with actual user name if available */}
                            <td>{booking.hotel_name || booking.guide_name || "N/A"}</td>
                            <td>{booking.room_type || "N/A"}</td>
                            <td>{booking.total_price.toLocaleString()}</td>
                            <td>{new Date(booking.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageBookings;
