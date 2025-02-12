import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AddNewCard.css";

const AddNewCard = () => {
  const navigate = useNavigate();
  
  // Retrieve user ID from local storage (saved during login)
  const userId = localStorage.getItem("user_id");
  
  // Card details states
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [saveCard, setSaveCard] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cardNumber || !expiryDate || !cvc || !cardHolder) {
      alert("Please fill in all card details.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/paymentinfo", {
        user_id: userId, // Using stored user ID
        card_number: cardNumber,
        expiry_date: expiryDate,
        cvc: cvc,
        card_holder: cardHolder,
        save_card: saveCard,
        selectedDate: new Date().toISOString().split("T")[0] // Current date
      });

      if (response.data.success) {
        alert("Payment successful!");
        navigate("/my-profile"); // Redirect user after payment
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="add-card-container">
      <h2>Add New Card</h2>
      <form onSubmit={handleSubmit}>
        <label>Card Number</label>
        <input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} required />

        <label>Expiry Date</label>
        <input type="month" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} required />

        <label>CVC</label>
        <input type="password" value={cvc} onChange={(e) => setCvc(e.target.value)} required />

        <label>Cardholder Name</label>
        <input type="text" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} required />

        <label>
          <input type="checkbox" checked={saveCard} onChange={() => setSaveCard(!saveCard)} />
          Save card for future purchases
        </label>

        <button type="submit">Pay</button>
      </form>
    </div>
  );
};

export default AddNewCard;
