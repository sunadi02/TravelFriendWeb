import React from "react";
import { useParams } from "react-router-dom";
import "./Bill.css"; // Import CSS styles
import jsPDF from "jspdf"; // For generating PDF

const Bill = () => {
  const { guideId, price, selectedDate, duration } = useParams();

  // Calculate commission (e.g., 10% commission)
  const commission = (parseFloat(price) * 0.1).toFixed(2);
  const totalAmount = (parseFloat(price) + parseFloat(commission)).toFixed(2);

  // Generate and download PDF
  const downloadBill = () => {
    const doc = new jsPDF();
    doc.text("TravelFriend Booking Bill", 10, 10);
    doc.text(`Guide ID: ${guideId}`, 10, 20);
    doc.text(`Date: ${selectedDate}`, 10, 30);
    doc.text(`Duration: ${duration} days`, 10, 40);
    doc.text(`Price: LKR ${price}`, 10, 50);
    doc.text(`Commission: LKR ${commission}`, 10, 60);
    doc.text(`Total Amount: LKR ${totalAmount}`, 10, 70);
    doc.save("booking_bill.pdf");
  };

  return (
    <div className="bill-container">
      <h2>Booking Bill</h2>
      <div className="bill-details">
        <p><strong>Guide ID:</strong> {guideId}</p>
        <p><strong>Date:</strong> {selectedDate}</p>
        <p><strong>Duration:</strong> {duration} days</p>
        <p><strong>Price:</strong> LKR {price}</p>
        <p><strong>Commission (10%):</strong> LKR {commission}</p>
        <p><strong>Total Amount:</strong> LKR {totalAmount}</p>
      </div>
      <button className="download-btn" onClick={downloadBill}>Download Bill as PDF</button>
    </div>
  );
};

export default Bill;