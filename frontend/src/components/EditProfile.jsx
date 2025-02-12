import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

const EditProfile = () => {
  const [user, setUser] = useState({ username: "", user_name: "", email: "", phone_number: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleSaveChanges = async () => {
    try {
      await axios.put("http://localhost:5000/api/user", user, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Profile updated successfully!");
      navigate("/my-profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="edit-profile">
      <h2>Edit Profile</h2>
      <form>
        <label>Username</label>
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />
        <label>Full Name</label>
        <input
          type="text"
          value={user.user_name}
          onChange={(e) => setUser({ ...user, user_name: e.target.value })}
        />
        <label>Email</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <label>Phone Number</label>
        <input
          type="text"
          value={user.phone_number}
          onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
        />
        <button type="button" onClick={handleSaveChanges}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;