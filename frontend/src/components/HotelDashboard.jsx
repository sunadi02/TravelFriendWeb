import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HotelDashboard.css";
import hotelAvatar from "../images/hotel_default.png"; // Hotel profile pic

const HotelDashboard = () => {
    const navigate = useNavigate();
    const [upcomingBookings, setUpcomingBookings] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [completedBookings, setCompletedBookings] = useState(0);
    const [cancelledBookings, setCancelledBookings] = useState(0);

    const [showProfilePopup, setShowProfilePopup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("role") !== "hotel") {
            navigate("/login"); // Redirect if not hotel
        }

        // Fetch hotel statistics
        axios.get("http://localhost:5000/api/hotels/stats", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then(response => {
            setUpcomingBookings(response.data.upcomingBookings);
            setAverageRating(response.data.averageRating);
            setTotalRevenue(response.data.totalRevenue);
            setCompletedBookings(response.data.completedBookings);
            setCancelledBookings(response.data.cancelledBookings);
        })
        .catch(error => console.error("Error fetching hotel stats:", error));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="hotel-dashboard">
            {/* Navbar */}
            <header className="hotel-navbar">
                <h1 className="logo">
                    <a href="/hotel-dashboard">
                        <span className="logo-blue">TRAVEL</span> FRIEND
                    </a>
                </h1>
                <nav className="header-nav">
                    <a href="/hotel-bookings">Bookings</a>
                    <a href="/hotel-revenue">Revenue</a>
                    <a href="/hotel-settings">Settings</a>
                </nav>
                <div className="header-right">
                    <button className="notification-bell">🔔</button>
                    <div className="user-info" onClick={() => setShowProfilePopup(!showProfilePopup)}>
                        <img src={hotelAvatar} alt="Hotel" className="profile-pic" />
                        <span>Hotel</span>
                    </div>

                    {showProfilePopup && (
                        <div className="profile-popup">
                            <ul>
                                <li><a href="/hotel-settings">Settings</a></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Overview Section */}
            <div className="overview">
                <h2>Hotel Dashboard Overview</h2>
                <div className="stats">
                    <div className="card upcoming">
                        <h4>Upcoming Bookings</h4>
                        <p>{upcomingBookings}</p>
                    </div>
                    <div className="card rating">
                        <h4>Average Rating</h4>
                        <p>{averageRating}</p>
                    </div>
                    <div className="card earnings">
                        <h4>Total Revenue</h4>
                        <p>LKR {totalRevenue}</p>
                    </div>
                </div>
                <div className="stats1">
                    <div className="card completed">
                        <h4>Completed Bookings</h4>
                        <p>{completedBookings}</p>
                    </div>
                    <div className="card cancelled">
                        <h4>Cancelled Bookings</h4>
                        <p>{cancelledBookings}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts">
                <div className="chart">
                    <h4>Number of Bookings per Day</h4>
                    <img src="/bookings-chart.png" alt="Bookings Chart" />
                </div>
                <div className="chart">
                    <h4>Revenue per Day</h4>
                    <img src="/revenue-chart.png" alt="Revenue Chart" />
                </div>
            </div>

            {/* Footer */}
            <footer className="hotel-footer">
                <p>© 2025 Travel Friend Hotel Panel. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default HotelDashboard;