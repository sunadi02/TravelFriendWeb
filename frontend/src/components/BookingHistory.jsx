import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookingHistory.css"; // Create this CSS file for styling

const BookingHistory = () => {
    
    const [bookings, setBookings] = useState([]);
  
    useEffect(() => {
      const fetchBookingDetails = async () => {
        const userId = localStorage.getItem("user_id"); // Get logged-in user ID from localStorage
        if (!userId) {
          console.error("No user ID found.");
          return;
        }
  
        try {
            const userId = localStorage.getItem("user_id"); // Get the logged-in user ID
            const response = await axios.get(`http://localhost:5000/api/bookings/${userId}`);
          setBookings(response.data.bookings);
        } catch (error) {
          console.error("Error fetching booking details:", error);
        }
      };
      fetchBookingDetails();
  }, []);

    return (
        <div className="booking-history">
            <h2>Booking History</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <table className="booking-table">
                    <thead>
                        <tr>
                            <th>Hotel Name</th>
                            <th>Room Type</th>
                            <th>Guide Name</th>
                            <th>Total Price (LKR)</th>
                            <th>Status</th>
                            <th>Booked At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking, index) => (
                            <tr key={index}>
                                <td>{booking.hotel_name || "N/A"}</td>
                                <td>{booking.room_type || "N/A"}</td>
                                <td>{booking.guide_name ? `${booking.guide_name}` : "N/A"}</td>
                                <td>LKR {booking.total_price}</td>
                                <td>{booking.status}</td>
                                <td>{new Date(booking.created_at).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default BookingHistory;
