import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BookHotel.css";
import 'boxicons/css/boxicons.min.css';
import defaultHotelImage from '../images/hotel_default.png';
import pp from '../images/pp.png';

const BookHotel = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hotels, setHotels] = useState([]);

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  
    const handleProfileClick = () => {
      setShowProfilePopup(!showProfilePopup);
    };

    const handleLogout = () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    };

  useEffect(() => {
    axios.get("http://localhost:5000/api/hotels")
      .then(response => setHotels(response.data.hotels))
      .catch(error => console.error("Error fetching hotels:", error));
  }, []);

  const filteredHotels = hotels.filter(hotel =>
    hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBookNow = (hotel_id) => {
    navigate(`/select-room/${hotel_id}`); // ✅ Correct route
  };

  return (
    <div className="book-hotels-page">
      {/* Navbar */}
      <header className="navbar">
        <div className="header-left">
          <h1 className="logo">
            <a href="/">
              <span className="logo-blue">TRAVEL</span> FRIEND
            </a>
          </h1>
        </div>
        <nav className="header-nav">
          <a href="/search-guides">Hire Guide</a>
          <a href="/book-hotel">Book Hotel</a>
          <a href="/about-us">About Us</a>
          <a href="/contact">Contact</a>
        </nav>
        <div className="header-right">
          <button className="notification-bell">🔔</button>
          <div className="user-info">
            <img src={pp} alt="Profile" className="profile-pic" onClick={handleProfileClick}></img>
          </div>
          {showProfilePopup && (
            <div className="profile-popup">
              <ul>
                <li><a href="/my-profile/:user_id">My Profile</a></li>
                <li><a href="/booking-history">Booking History</a></li>
                <li><a href="/settings">Settings</a></li>
                <li><a href="/support-feedback">Support & Feedback</a></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
      )}
        </div>
        
      </header>

      {/* Title Section */}
      <div className="title-section1">
        <h1>FIND YOUR PERFECT HOTEL</h1>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Hotel"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="bx bx-search"></i>
      </div>

      {/* Hotels List */}
      <div className="hotels-section">
        <h2>Available Hotels</h2>
        <div className="hotel-cards">
          {filteredHotels.map((hotel, index) => (
            <div className="hotel-card" key={index}>
              <img src={hotel.image || defaultHotelImage} alt={hotel.hotel_name} className="hotel-image" />
              <h3>{hotel.hotel_name}</h3>
              <p>{hotel.location || "Location not provided"}</p>
              <p className="rating">⭐ {hotel.ratings}</p>
              <p className="description">"{hotel.description}"</p>
              <button className="book-btn" onClick={() => handleBookNow(hotel.hotel_id)}> {/* ✅ Corrected */}
                Book Now
              </button>
              <p className="price">LKR {hotel.price_range}/night</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Travel Friend. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default BookHotel;
