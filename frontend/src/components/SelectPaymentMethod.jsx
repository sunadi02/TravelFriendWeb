import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SelectPaymentMethod.css"; 
import cardIcon from "../images/card.png";
import cashIcon from "../images/cash.png";
import visaIcon from "../images/visa.png";

const SelectPaymentMethod = () => {
  const { guideId, hotelId, roomId, price, selectedDate, duration } = useParams();
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState(""); 
  const [savedCards, setSavedCards] = useState([]);
  const [user, setUser] = useState(null); // Store user details

  // Check if booking is for a guide or a hotel
  const isGuideBooking = Boolean(guideId);
  const isHotelBooking = Boolean(hotelId);

  // Calculate 10% commission and total price
  const commission = (parseFloat(price) * 0.1).toFixed(2);
  const totalPrice = (parseFloat(price) + parseFloat(commission)).toFixed(2);
  const guideFee = price; // Assuming guide fee is the original price

  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:5000/api/user/${userId}`)
        .then(response => {
          setUser(response.data);
          console.log("User data received:", response.data); // Debugging
        })
        .catch(error => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:5000/api/paymentinfo/${user.user_id}`)
        .then(response => setSavedCards(response.data.cards))
        .catch(error => console.error("Error fetching saved cards:", error));
    }
  }, [user]);

  const handlePaymentSelection = (method) => {
    setSelectedMethod(method);
  };

  const handlePayClick = async () => {
    if (!selectedMethod) {
        alert("Please select a payment method.");
        return;
    }

    try {
        let paymentDetails = {
            payment_method: selectedMethod === "cash" ? "cash" : "card",
            card_number: selectedMethod === "cash" ? null : selectedMethod,
        };

        // Save booking to the database
        await axios.post("http://localhost:5000/api/bookings", {
            user_id: user.user_id,
            guide_id: isGuideBooking ? guideId : null,
            hotel_id: isHotelBooking ? hotelId : null,
            room_id: isHotelBooking ? roomId : null,
            total_price: totalPrice,
            commission: commission,
            guide_fee: guideFee,
            status: "Confirmed",
            payment_method: paymentDetails.payment_method,
            card_number: paymentDetails.card_number,
        });

        if (selectedMethod === "cash") {
            alert(`Booking confirmed!\nDate: ${selectedDate}\nDuration: ${duration} days\nTotal: LKR ${totalPrice}`);
        } else {
            alert(`Payment successful!\nBooking confirmed.\nTotal: LKR ${totalPrice}`);
        }

        // Redirect to the profile page after successful booking
        navigate("/my-profile");
    } catch (error) {
        console.error("Booking error:", error);
        alert("Failed to process booking. Please try again.");
    }
};

  return (
    <div className="payment-container">
      <h2>Select Payment Method</h2>
      <p>Choose a payment method</p>

      {savedCards.length > 0 && savedCards.map((card, index) => (
        <div 
          key={index}
          className={`payment-option ${selectedMethod === card.card_number ? "selected" : ""}`}
          onClick={() => setSelectedMethod(card.card_number)}
        >
          <img src={visaIcon} alt="Visa" className="payment-icon" />
          <span>{card.card_holder} - **** {card.card_number.slice(-4)}</span>
          <input type="radio" checked={selectedMethod === card.card_number} readOnly />
        </div>
      ))}

      <div 
        className={`payment-option ${selectedMethod === "card" ? "selected" : ""}`}
        onClick={() => handlePaymentSelection("card")}
      >
        <img src={cardIcon} alt="Card" className="payment-icon" />
        <span>Use a New Card</span>
        <input type="radio" checked={selectedMethod === "card"} readOnly />
      </div>

      <div
        className={`payment-option ${selectedMethod === "cash" ? "selected" : ""}`}
        onClick={() => handlePaymentSelection("cash")}
      >
        <img src={cashIcon} alt="Cash" className="payment-icon" />
        <span>Cash Payment</span>
        <input type="radio" checked={selectedMethod === "cash"} readOnly />
      </div>

      <div className="user-details">
        <p><strong>Name:</strong> {user?.user_name || "N/A"}</p>
        <p><strong>Email:</strong> {user?.email || "N/A"}</p>
        <p><strong>Contact No.:</strong> {user?.phone_number || "N/A"}</p>
        <p><strong>Total Price:</strong> LKR {price}</p>
        <p><strong>Commission (10%):</strong> LKR {commission}</p>
        <p><strong>Total Amount:</strong> LKR {totalPrice}</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Duration:</strong> {duration} days</p>
      </div>

      <button className="pay-button" onClick={handlePayClick}>Pay</button>
    </div>
  );
};

export default SelectPaymentMethod;