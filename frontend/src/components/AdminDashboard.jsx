import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
import admin from '../images/pp.png';

function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/"); // Redirect if not admin
        }
    }, [navigate]);

    return (
        <div className="admin-dashboard">
            <nav className="admin-navbar">
                <h2 className="logo">
                    <span className="travel">TRAVEL </span>
                    <span className="friend">FRIEND</span>
                </h2>
                <div className="profile">
                    <img src={admin} alt="Admin" className="admin-avatar" />
                    <p>Welcome, Admin!</p>
                </div>
            </nav>

            <div className="overview">
                <h3>Overview</h3>
                <div className="stats">
                    <div className="card">
                        <h4>Total Users</h4>
                        <p>5,420</p>
                    </div>
                    <div className="card premium">
                        <h4>Total Premium Users</h4>
                        <p>1,380</p>
                    </div>
                    <div className="card bookings">
                        <h4>Total Bookings</h4>
                        <p>1,380</p>
                    </div>
                    <div className="card cancellations">
                        <h4>Total Cancellations</h4>
                        <p>120</p>
                    </div>
                    <div className="card revenue">
                        <h4>Total Revenue</h4>
                        <p>LKR 25,125,000</p>
                    </div>
                </div>
            </div>

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
        </div>
    );
}

export default AdminDashboard;
