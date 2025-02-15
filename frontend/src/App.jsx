// App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import HomePage from "./components/HomePage";
import SearchGuides from "./components/SearchGuides";
import ViewGuide from "./components/ViewGuide";
import SelectPaymentMethod from "./components/SelectPaymentMethod";
import AddNewCard from "./components/AddNewCard";
import BookHotel from "./components/BookHotel";
import SelectRoom from "./components/SelectRoom";
import Bill from "./components/SelectRoom";
import MyProfile from "./components/MyProfile";
import EditProfile from "./components/EditProfile";
import BookingHistory from "./components/BookingHistory";
import AdminDashboard from "./components/AdminDashboard";

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminStatus = localStorage.getItem("isAdmin") === "true";

        if (token) {
            setLoggedIn(true);
            setIsAdmin(adminStatus); // Check if the user is an admin
        }
    }, []);

    const user = { fullName: "Maria Anthony" };

    return (
        <Router>
            <Routes>
            {!loggedIn ? (
                    <>
                        <Route path="/login" element={<LoginForm setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </>
                ) : isAdmin ? (
                    <>
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                    </>
                ) : (
                    <>
                        <Route path="/" element={<HomePage user={user} />} />
                        <Route path="/search-guides" element={<SearchGuides />} />
                        <Route path="/book-hotel" element={<BookHotel />} />
                        <Route path="/view-guide/:guideId" element={<ViewGuide />} />
                        <Route path="/select-payment/:guideId/:price/:selectedDate/:duration" element={<SelectPaymentMethod />} />
                        <Route path="/select-payment/hotel/:hotelId/:roomId/:price" element={<SelectPaymentMethod />} />
                        <Route path="/select-room/:hotelId" element={<SelectRoom />} />
                        <Route path="/add-card/:guideId/:price/:selectedDate/:duration" element={<AddNewCard />} />
                        <Route path="/bill/:guideId/:price/:selectedDate/:duration" element={<Bill />} />
                        <Route path="/my-profile/:userId/" element={<MyProfile />} />
                        <Route path="/booking-history" element={<BookingHistory />} />
                        <Route path="/edit-profile/:userId" element={<EditProfile />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
