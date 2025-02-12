import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyProfile.css";
import pp from '../images/pp.png';

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("user_id"); // Get logged-in user ID from localStorage
      if (!userId) {
        console.error("No user ID found.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:5000/api/user/${userId}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <div className="my-profile">
      <h2>My Profile</h2>
      {user ? (
        <div className="profile-details">
          <img src={setUser.image ? setUser.image : pp } alt="Profile" className="profile-image" />
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Full Name:</strong> {user.user_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone Number:</strong> {user.phone_number}</p>
          <button onClick={handleEditProfile}>Edit Profile</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyProfile;
