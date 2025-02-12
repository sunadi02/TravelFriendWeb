
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewGuide.css";
import pp from '../images/pp.png';
  

const ViewGuide = () => {
  const { guideId } = useParams();
  const [guide, setGuide] = useState(null); // Store fetched guide
  const [selectedDate, setSelectedDate] = useState("");
  const [duration, setDuration] = useState(1); // Default is 1 day
  const [loading, setLoading] = useState(true); // Show loading state

  useEffect(() => {
    axios.get(`http://localhost:5000/api/guides/${guideId}`)
        .then(response => {
            setGuide(response.data); // Use response.data directly
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching guide:", error);
            setLoading(false);
        });
}, [guideId]);

const navigate = useNavigate();

if (loading) return <h2>Loading...</h2>;

if (!guide) return <h2>Guide not found!</h2>;

  return (
    <div className="view-guide">
      {/* Header */}
      <header className="homepage-header">
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
            <span>John Doe</span> {/* Replace with dynamic user name if available */}
          </div>
        </div>
      </header>

      {/* Guide Profile Section */}
      <div className="guide-profile">
        
        <img src={guide.profile_pic || pp} alt={guide.guide_name} className="profile-pic" />

        <h2>{guide.guide_name}</h2>
        <p><strong>Username:</strong> {guide.username}</p>
        <p><strong>Email:</strong> {guide.email}</p>
        <p><strong>Location:</strong> {guide.location}</p>
        {/* <p><strong>Specialization:</strong> {guide.specialization}</p> */}
        <p><strong>Languages Spoken:</strong> {guide.languages}</p>
        <p><strong>Price per day:</strong> LKR {guide.hourly_rate}</p>
        <p><strong>Ratings:</strong> ⭐{guide.rating}</p>
        {/* <p><strong>Total Bookings:</strong> {guide.bookings}</p>
        <p><strong>Availability:</strong> {guide.availability}</p> */}
      </div>

      {/* Tour Booking Section */}
      <div className="tour-booking">
        <h3>Select Tour Date</h3>
        <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]} // Restrict past dates
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
        <h3>Duration</h3>
        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
                    {[...Array(7)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? "day" : "days"}
                        </option>
                    ))}
                </select>
        <h3>Estimated Price</h3>
        <p>LKR {guide.hourly_rate * duration}</p>
        <button 
    className="hire-btn"
    onClick={() => navigate(`/select-payment/${guide.guide_id}/${guide.hourly_rate * duration}/${selectedDate}/${duration}`)}
>
    Hire
</button>
        <button className="message-btn">Message</button>
      </div>

      {/* Guest Reviews Section */}
      <div className="guest-reviews">
        <h3>Guest Reviews</h3>
        <div className="review">
          <p><strong>Faizan from Turkey</strong></p>
          <p>Pool with amazing views and spotlessly clean rooms</p>
        </div>
        <div className="review">
          <p><strong>Victoria from Netherlands</strong></p>
          <p>Pool with amazing views and spotlessly clean rooms. Hotel staff is excellent and very kind.</p>
        </div>
        <div className="review">
          <p><strong>Maria from Cyprus</strong></p>
          <p>Pool with amazing views and spotlessly clean rooms</p>
        </div>
      </div>

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

export default ViewGuide;
