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
import ManageBookings from "./components/ManageBookings";
import ManageUsers from "./components/ManageUsers";
import ManageGuides from "./components/ManageGuides";
import AddGuideForm from "./components/AddGuideForm";
import ManageHotels from "./components/ManageHotels";
import AddHotelForm from "./components/AddHotelForm";
import ManageRooms from "./components/ManageRooms";
import GuideDashboard from "./components/GuideDashboard";
import HotelDashboard from "./components/HotelDashboard";
import GuideBookings from "./components/GuideBookings";


function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isGuide, setIsGuide] = useState(false);
    const [isHotel, setIsHotel] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const adminStatus = localStorage.getItem("isAdmin") === "true";
        const guideStatus = localStorage.getItem("role") === "guide";
        const hotelStatus = localStorage.getItem("role") === "hotel";

        if (token) {
            setLoggedIn(true);
            setIsAdmin(adminStatus);
            setIsGuide(guideStatus === "guide");
            setIsHotel(hotelStatus === "hotel");
        }
    }, []);

    const user = { fullName: "Maria Anthony" };

    return (
        <Router>
            <Routes>
                {!loggedIn ? (
                    <>
                        <Route path="/login" element={<LoginForm setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} setIsGuide={setIsGuide} setIsHotel={setIsHotel} />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/" element={<Navigate to="/login" />} />
                    </>
                ) : isAdmin ? (
                    <>
                        <Route path="/login" element={<LoginForm setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} setIsGuide={setIsGuide} setIsHotel={setIsHotel} />} />
                        <Route path="/admin-dashboard" element={<AdminDashboard />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/manage-bookings" element={<ManageBookings />} />
                        <Route path="/manage-users" element={<ManageUsers />} />
                        <Route path="/manage-guides" element={<ManageGuides />} />
                        <Route path="/add-guide" element={<AddGuideForm />} />
                        <Route path="/manage-hotels" element={<ManageHotels />} />
                        <Route path="/add-hotel" element={<AddHotelForm />} />
                        <Route path="/manage-rooms/:hotelId" element={<ManageRooms />} />
                        <Route path="*" element={<Navigate to="/admin-dashboard" />} />
                    </>
                ) : isGuide ? (
                    <>
                        <Route path="/login" element={<LoginForm setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} setIsGuide={setIsGuide} setIsHotel={setIsHotel} />} />
                        <Route path="/guide-dashboard" element={<GuideDashboard />} />
                        <Route path="/guide-bookings" element={<GuideBookings />}/>
                        <Route path="*" element={<Navigate to="/guide-dashboard" />} />
                    </>
                ) : isHotel ? (
                    <>
                        <Route path="/login" element={<LoginForm setLoggedIn={setLoggedIn} setIsAdmin={setIsAdmin} setIsGuide={setIsGuide} setIsHotel={setIsHotel} />} />
                        <Route path="/hotel-dashboard" element={<HotelDashboard />} />
                        <Route path="*" element={<Navigate to="/hotel-dashboard" />} />
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
