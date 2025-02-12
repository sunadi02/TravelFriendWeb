import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    useEffect(() => {
        const isAdmin = localStorage.getItem("isAdmin") === "true";
        if (!isAdmin) {
            navigate("/");
        }
    }, [navigate]);

    return <h1>Admin Dashboard</h1>;
}

export default AdminDashboard;
