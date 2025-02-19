import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import adminAvatar from "../images/pp.png"; // Admin profile pic

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [totalUsers, setTotalUsers] = useState(0);
    const [premiumUsers, setPremiumUsers] = useState(0);
    const [totalBookings, setTotalBookings] = useState(0);
    const [cancellations, setCancellations] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const [showProfilePopup, setShowProfilePopup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/"); // Redirect if not admin
        }

        // Fetch statistics
        axios.get("http://localhost:5000/api/admins/stats")
            .then(response => {
                setTotalUsers(response.data.totalUsers);
                setPremiumUsers(response.data.premiumUsers);
                setTotalBookings(response.data.totalBookings);
                setCancellations(response.data.cancellations);
                setTotalRevenue(response.data.totalRevenue);
            })
            .catch(error => console.error("Error fetching admin stats:", error));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="admin-dashboard">
            {/* Navbar */}
            <header className="admin-navbar">
                <h1 className="logo">
                    <a href="/">
                        <a href="/admin-dashboard"><span className="logo-blue">TRAVEL</span> FRIEND</a>
                    </a>
                </h1>
                <nav className="header-nav">
                    
                    <a href="/manage-users">Users</a>
                    <a href="/manage-bookings">Bookings</a>
                    <a href="/manage-guides">Guides</a>
                    <a href="/manage-hotels">Hotels</a>
                </nav>
                <div className="header-right">
                    <button className="notification-bell">🔔</button>
                    <div className="user-info" onClick={() => setShowProfilePopup(!showProfilePopup)}>
                        <img src={adminAvatar} alt="Admin" className="profile-pic" />
                        <span>Admin</span>
                    </div>

                    {showProfilePopup && (
                        <div className="profile-popup">
                            <ul>
                                <li><a href="/admin-settings">Settings</a></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Overview Section */}
            <div className="overview">
                <h2>Dashboard Overview</h2>
                <div className="stats">
                    <div className="card"><h4>Total Users</h4><p>{totalUsers}</p></div>
                    <div className="card premium"><h4>Premium Users</h4><p>{premiumUsers}</p></div>
                    <div className="card bookings"><h4>Total Bookings</h4><p>{totalBookings}</p></div>
                </div>
                <div className="stats1">
                <div className="card cancellations"><h4>Total Cancellations</h4><p>{cancellations}</p></div>
                <div className="card revenue"><h4>Total Revenue</h4><p>LKR {totalRevenue}</p></div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts">
                <div className="chart">
                    <h4>Number of Guide Hiring per Day</h4>
                    <img src="/guide-chart.png" alt="Guide Chart" />
                </div>
                <div className="chart">
                    <h4>Number of Hotel Bookings per Day</h4>
                    <img src="/hotel-chart.png" alt="Hotel Chart" />
                </div>
            </div>

            {/* Footer */}
            <footer className="admin-footer">
                <p>© 2025 Travel Friend Admin Panel. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default AdminDashboard;
