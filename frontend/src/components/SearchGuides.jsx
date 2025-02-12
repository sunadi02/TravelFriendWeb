import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SearchGuides.css";
import 'boxicons/css/boxicons.min.css';
import pp from '../images/pp.png';

//  Remove hardcoded guides, instead fetch from API
const SearchGuides = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [guides, setGuides] = useState([]); // Guides from DB

  // Fetch guides from backend API
  useEffect(() => {
    axios.get("http://localhost:5000/api/guides")
      .then(response => {
        setGuides(response.data.guides);
      })
      .catch(error => {
        console.error("Error fetching guides:", error);
      });
  }, []);

  // Filter guides by search term
  const filteredGuides = guides.filter(guide =>
    guide.guide_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="search-guides-page">
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
            <img src={pp} alt="Profile" className="profile-pic" />
            <span></span>
          </div>
        </div>
      </header>

      {/* Title Section */}
      <div className="title-section">
        <h1>DISCOVER YOUR PERFECT LOCAL GUIDE WITH SHOWAROUND</h1>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search Guide"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <i className="bx bx-search"></i>
      </div>

      {/* Guides List */}
      <div className="guides-section">
        <h2>Popular Guides in Colombo</h2>
        <div className="guide-cards">
          {filteredGuides.map((guide, index) => (
            <div className="guide-card"
              key={index}
              onClick={() => navigate(`/view-guide/${guide.guide_id}`)}
              style={{ cursor: "pointer" }} // Make card clickable
            >
              {/*  Display uploaded image OR default image */}
              {/* <img src={guide.profile_pic ? `http://localhost:5000/uploads/${guide.profile_pic}` : pp}
                alt={guide.guide_name}
                className="guide-image"
              /> */}
              <img src={guide.profile_pic.startsWith("http") ? guide.profile_pic : `http://localhost:5000/uploads/${guide.profile_pic}`} 
              alt={guide.name} 
              className="guide-image" />


              <h3>{guide.guide_name}</h3>
              <p>{guide.location || "Location not provided"}</p>
              <p className="rating">⭐ {guide.rating}</p>
              <p className="description">"{guide.description}"</p>
              <button className="hire-btn" onClick={(e) => {
                e.stopPropagation();
                navigate(`/view-guide/${guide.guide_id}`);
              }}>Hire</button>

              <p className="price">LKR {guide.hourly_rate}/day</p>
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

export default SearchGuides;
