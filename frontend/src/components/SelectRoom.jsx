import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./SelectRoom.css";
import 'boxicons/css/boxicons.min.css';
import pp from '../images/pp.png';
import defaultHotelImage from '../images/hotel_default.png';

const SelectRoom = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [rooms, setRooms] = useState([]);
    const [hotel, setHotel] = useState(null);

    const [showProfilePopup, setShowProfilePopup] = useState(false);
    
      const handleProfileClick = () => {
        setShowProfilePopup(!showProfilePopup);
      };
    
      const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      };

    useEffect(() => {
        axios.get(`http://localhost:5000/api/hotels/${hotelId}`)
            .then(response => setHotel(response.data))
            .catch(error => console.error("Error fetching hotel details:", error));

        axios.get(`http://localhost:5000/api/rooms/${hotelId}`)
            .then(response => setRooms(response.data.rooms))
            .catch(error => console.error("Error fetching rooms:", error));
    }, [hotelId]);

    const filteredRooms = rooms.filter(room =>
        room.room_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBookNow = (roomId, pricePerNight) => {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
            alert("You must be logged in to book a room.");
            return;
        }
    
        // Navigate to the SelectPaymentMethod page with hotel details
        navigate(`/select-payment/hotel/${hotelId}/${roomId}/${pricePerNight}`);
    };
    

    return (
        <div className="select-room">
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
                        <img src={pp} alt="Profile" className="profile-pic" onClick={handleProfileClick}/>
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

            {/* Hotel Details Section */}
            {hotel && (
                <div className="hotelroom-details">
                    <img src={hotel.image || defaultHotelImage} alt={hotel.hotel_name} className="hotel-image1" />
                    <div className="hotelinfo-all">
                    <h1>{hotel.hotel_name}</h1>
                    
                    <p className="description">{hotel.description}</p>
                    <p className="location">Location:{hotel.location}</p>
                    <p className="price-range">Price Range: LKR {hotel.price_range}</p>
                    <p className="contact">Contact No: {hotel.phone_number}</p>
                    <p className="email">Email: {hotel.email}</p>
                    <p className="rating">⭐ {hotel.ratings}</p>
                    </div>
                    
                </div>
            )}

            {/* Search Bar */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search Room Type"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="bx bx-search"></i>
            </div>

            {/* Room List */}
            <div className="rooms-section">
                <h2>Available Rooms</h2>
                <div className="room-cards">
                    {filteredRooms.map((room, index) => (
                        <div className="room-card" key={index}>
                            <img src={room.image ? `http://localhost:5000/uploads/${room.image}` : defaultHotelImage} alt={room.room_type} className="room-image" />
                            <h3>{room.room_type}</h3>
                            <p>Price: LKR {room.price_per_night} per night</p>
                            <p className="availability">{room.availability ? "Available" : "Not Available"}</p>
                            <button className="book-btn" onClick={() => handleBookNow(room.room_id, room.price_per_night)}>
                                Book Now
                            </button>
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

export default SelectRoom;
