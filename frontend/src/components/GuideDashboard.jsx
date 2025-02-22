import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./GuideDashboard.css";
import pp from "../images/pp.png";
import chart1 from "../images/guidechart1.png";
import chart2 from "../images/guidechart2.png";

const GuideDashboard = () => {
    const navigate = useNavigate();
    const [upcomingHires, setUpcomingHires] = useState(0);
    const [averageRating, setAverageRating] = useState(0);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [completedTours, setCompletedTours] = useState(0);
    const [cancelledTours, setCancelledTours] = useState(0);
    const [profilePic, setProfilePic] = useState(pp); // Default profile picture
    const [showProfilePopup, setShowProfilePopup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("role") !== "guide") {
            navigate("/login"); // Redirect if not guide
        }

        // Fetch guide details including profile picture
        const fetchGuideDetails = async () => {
            try {
                const guideId = localStorage.getItem("guide_id");
                const token = localStorage.getItem("token");

                if (!guideId || !token) {
                    console.error("Guide ID or token not found in localStorage.");
                    return;
                }

                const response = await axios.get(`http://localhost:5000/api/guides/${guideId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.data.profile_pic) {
                    setProfilePic(`http://localhost:5000/uploads/${response.data.profile_pic}`);
                }
            } catch (error) {
                console.error("Error fetching guide details:", error);
            }
        };

        // Fetch guide statistics
        const fetchGuideStats = async () => {
            try {
                const guideId = localStorage.getItem("guide_id");
                const token = localStorage.getItem("token");
        
                if (!guideId || !token) {
                    console.error("Guide ID or token not found in localStorage.");
                    return;
                }
        
                // Fetch total earnings (guide fees)
                const earningsResponse = await axios.get(
                    `http://localhost:5000/api/guides/total-earnings/${guideId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const totalEarnings = earningsResponse.data.totalEarnings;
        
                // Fetch other stats (upcoming hires, average rating, etc.)
                const statsResponse = await axios.get("http://localhost:5000/api/guides/stats", {
                    params: { guide_id: guideId },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
        
                setUpcomingHires(statsResponse.data.upcomingHires);
                setAverageRating(statsResponse.data.averageRating);
                setTotalEarnings(totalEarnings); // Set total earnings from guide fees
                setCompletedTours(statsResponse.data.completedTours);
                setCancelledTours(statsResponse.data.cancelledTours);
            } catch (error) {
                console.error("Error fetching guide stats:", error);
            }
        };

        fetchGuideDetails();
        fetchGuideStats();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("guide_id"); // Clear guide_id on logout
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
                    <Link to="/guide-bookings">Bookings</Link>
                    <a href="/guide-revenue">Revenue</a>
                    <a href="/guide-settings">Settings</a>
                </nav>
                <div className="header-right">
                    <button className="notification-bell">🔔</button>
                    <div className="user-info" onClick={() => setShowProfilePopup(!showProfilePopup)}>
                        <img src={profilePic} alt="Guide" className="profile-pic" />
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
                    <img src={chart1} alt="Guide Hiring Chart" />
                </div>
                <div className="chart">
                    <h4>Number of Hotel Bookings per Day</h4>
                    <img src={chart2} alt="Hotel Bookings Chart" />
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