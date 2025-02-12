import React, { useState, useEffect } from "react";
import { getBookings, deleteBooking } from "../services/api";

function BookingList() {
    const [bookings, setBookings] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await getBookings();
                setBookings(data.bookings);
            } catch (err) {
                setError(err.response?.data?.error || "Failed to fetch bookings");
            }
        };
        fetchBookings();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteBooking(id);
            setBookings(bookings.filter((booking) => booking.booking_id !== id));
        } catch (err) {
            alert("Failed to delete booking");
        }
    };

    return (
        <div>
            <h2>My Bookings</h2>
            {error && <p>{error}</p>}
            <ul>
                {bookings.map((booking) => (
                    <li key={booking.booking_id}>
                        {booking.hotel_name || booking.guide_name}: ${booking.total_price}
                        <button onClick={() => handleDelete(booking.booking_id)}>Cancel</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default BookingList;
