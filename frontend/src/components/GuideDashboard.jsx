import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./GuideDashboard.css";
import guideAvatar from "../images/pp.png"; // Guide profile pic

const GuideDashboard = () => {
    const navigate = useNavigate();
    const [upcomingHires, setUpcomingHires] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [completedTours, setCompletedTours] = useState(0);
    const [cancelledTours, setCancelledTours] = useState(0);

    const [showProfilePopup, setShowProfilePopup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("role") !== "guide") {
            navigate("/login"); // Redirect if not guide
        }

        // Fetch guide statistics
        axios.get("http://localhost:5000/api/guides/stats", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
        )
        .then(response => {
            setUpcomingHires(response.data.upcomingHires);
            setAverageRating(response.data.averageRating);
            setTotalEarnings(response.data.totalEarnings);
            setCompletedTours(response.data.completedTours);
            setCancelledTours(response.data.cancelledTours);
        })
        .catch(error => console.error("Error fetching guide stats:", error));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <div className="guide-dashboard">
            {/* Navbar */}
            <header className="guide-navbar">
                <h1 className="logo">
                    <a href="/guide-dashboard">
                        <span className="logo-blue">TRAVEL</span> FRIEND
                    </a>
                </h1>
                <nav className="header-nav">
                    <a href="/guide-bookings">Bookings</a>
                    <a href="/guide-revenue">Revenue</a>
                    <a href="/guide-settings">Settings</a>
                </nav>
                <div className="header-right">
                    <button className="notification-bell">🔔</button>
                    <div className="user-info" onClick={() => setShowProfilePopup(!showProfilePopup)}>
                        <img src={guideAvatar} alt="Guide" className="profile-pic" />
                        <span>Guide</span>
                    </div>

                    {showProfilePopup && (
                        <div className="profile-popup">
                            <ul>
                                <li><a href="/guide-settings">Settings</a></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Overview Section */}
            <div className="overview">
                <h2>Guide Dashboard Overview</h2>
                <div className="stats">
                    <div className="card upcoming">
                        <h4>Upcoming Hires</h4>
                        <p>{upcomingHires}</p>
                    </div>
                    <div className="card rating">
                        <h4>Average Rating</h4>
                        <p>{averageRating}</p>
                    </div>
                    <div className="card earnings">
                        <h4>Total Earnings</h4>
                        <p>LKR {totalEarnings}</p>
                    </div>
                </div>
                <div className="stats1">
                    <div className="card completed">
                        <h4>Completed Tours</h4>
                        <p>{completedTours}</p>
                    </div>
                    <div className="card cancelled">
                        <h4>Cancelled Tours</h4>
                        <p>{cancelledTours}</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts">
                <div className="chart">
                    <h4>Number of Guide Hiring per Day</h4>
                    <img src="/guide-hiring-chart.png" alt="Guide Hiring Chart" />
                </div>
                <div className="chart">
                    <h4>Number of Hotel Bookings per Day</h4>
                    <img src="/hotel-bookings-chart.png" alt="Hotel Bookings Chart" />
                </div>
            </div>

            {/* Footer */}
            <footer className="guide-footer">
                <p>© 2025 Travel Friend Guide Panel. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default GuideDashboard;