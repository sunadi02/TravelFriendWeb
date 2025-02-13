import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import 'boxicons/css/boxicons.min.css';
import discountImage from '../images/discount.png';
import axios from "axios";
import pp from '../images/pp.png';


const HomePage = ({ fullName }) => {
  const navigate = useNavigate();
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  const handleProfileClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const [places, setPlaces] = useState([]);
const [hotels, setHotels] = useState([]);
const [guides, setGuides] = useState([]);

const handleBookNow = (hotel_id) => {
  navigate(`/select-room/${hotel_id}`); // ✅ Correct route
};

// Fetch data from API
useEffect(() => {
  axios.get("http://localhost:5000/api/places")
      .then(response => setPlaces(response.data.places))
      .catch(error => console.error("Error fetching places:", error));

  axios.get("http://localhost:5000/api/hotels")
      .then(response => setHotels(response.data.hotels))
      .catch(error => console.error("Error fetching hotels:", error));

  axios.get("http://localhost:5000/api/guides")
      .then(response => setGuides(response.data.guides))
      .catch(error => console.error("Error fetching guides:", error));
  
}, []);

  return (
    <div className="homepage">
      {/* Header */}
      <header className="homepage-header">
        <div className="header-left">
        <h1 className="logo">
              <a href="/">
            
              <span className="logo-blue">TRAVEL</span> FRIEND </a>
           
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
          <div className="user-info" onClick={handleProfileClick}>
            <img
              src={pp}
              alt="Profile"
              className="profile-pic"
            />
            <span>{fullName}</span>
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

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h2>Welcome, User!</h2>
          <h1>Start </h1>
          <h1>Planning</h1>
          <h1>Your Journey!</h1>
          <button className="plan-trip-btn" onClick={() => window.location.href = "/search-guides"}>
  Plan Your Trip
</button>

        </div>
      </div>

      {/* Search Box Section */}
      <div className="search-section">
        <div className="search-box">
          <h3>Search Guides and Hotels</h3>
          <div className="search-fields">
            <input type="text" placeholder="Enter your destination..." />
            <div className="dates">
              <input type="text" placeholder="Select dates: Sun 13 Oct - Mon 14 Oct" />
            </div>
            <div className="rooms">
              <input type="text" placeholder="1 Room - 2 Adults - 0 Children" />
            </div>
            <div className="search-buttons">
              <button className="search-btn" onClick={() => window.location.href = "/book-hotel"}>Search Hotels</button>
              <button className="search-btn" onClick={() => window.location.href = "/search-guides"}>
                Search Guides
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Discount Offer Box */}
      <div className="discount-offer">
        <div className="discount-content">
          <h3>Get 10% Off Premium Membership!</h3>
          <p>Exclusive Access To 5-Star Hotels And Premium Travel Guides. Enjoy a 10% Discount on All Bookings with TravelFriend!. Limited Time Only.</p>
          <p>Terms and conditions apply. Offer valid until 31st April.</p>
          <button className="upgrade-btn">Upgrade Now</button>
        </div>
        <div className="discount-image">
          <img src={discountImage} alt="Discount Offer" />
        </div>
      </div>

      {/* Popular Places Section */}
      <section className="places-section">
        <div className="section-header">
          <h2>Popular Places</h2>
          <a href="/all-places" className="see-all">See All</a>
        </div>
        <div className="card-container">
          {places.map((place, index) => (
            <div className="card" key={index}>
              <img src={place.image} alt={place.title} className="card-image" />
              <h3 className="card-title">{place.title}</h3>
              <p className="card-description">{place.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Hotels Section */}
      <section className="hotels-section">
        <div className="section-header">
          <h2>Explore Hotels</h2>
          <a href="/all-hotels" className="see-all">See All</a>
        </div>
        <div className="card-container">
          {hotels.map((hotel, index) => (
            <div className="card" key={index} onClick={() => handleBookNow(hotel.hotel_id)}>
              <img src={hotel.image} alt={hotel.title} className="card-image" />
              <h3 className="card-title">{hotel.hotel_name}</h3>
              <p className="card-description">{hotel.description}</p>
              <h4>{hotel.location}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Guides Section */}
<section className="guides-section">
  <div className="section-header">
    <h2>Featured Guides</h2>
    <a href="/all-guides" className="see-all">See All</a>
  </div>
  <div className="card-container">
    {guides.map((guide, index) => (
      <div className="card" key={index} onClick={() => navigate(`/view-guide/${guide.guide_id}`)}>
        <img src={guide.profile_pic } alt={guide.guide_name} className="card-image" />
        <h3 className="card-title">{guide.guide_name}</h3>
        <h4>{guide.location}</h4>
        <p className="card-description">{guide.experience} years of experience</p>
      </div>
    ))}
  </div>
</section>

       {/* Footer */}
       <footer className="homepage-footer">
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><a href="/help-center">Help Center</a></li>
            <li><a href="/faqs">FAQs</a></li>
            <li><a href="/contact-us">Contact Us</a></li>
            <li><a href="/live-chat-support">Live Chat Support</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Terms & Settings</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-conditions">Terms & Conditions</a></li>
            <li><a href="/cookie-policy">Cookie Policy</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><a href="/about-us">About Us</a></li>
            <li><a href="/our-team">Our Team</a></li>
            <li><a href="/careers">Careers</a></li>
            <li><a href="/press">Press</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <p>📞 +94 11 8018011</p>
          <p>🏠 143/21, Pelawatta, Pannipitiya</p>
          <p>✉️ <a href="mailto:TravelFriend@gmail.com">TravelFriend@gmail.com</a></p>
        </div>
        <div className="footer-bottom">
          <div className="footer-left">
            <p>&copy; 2025 Travel Friend. All rights reserved.</p>
          </div>
          <div className="footer-right">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Facebook">
              <i className='bx bxl-facebook'></i>
            </a>
            <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Behance">
              <i className='bx bxl-behance'></i>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <i className='bx bxl-github'></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
              <i className='bx bxl-instagram'></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
