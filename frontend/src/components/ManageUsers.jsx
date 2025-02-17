import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageUsers.css";

const ManageUsers = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/");
        }

        axios.get("http://localhost:5000/api/users")
            .then(response => setUsers(response.data.users))
            .catch(error => console.error("Error fetching users:", error));
    }, [navigate]);

    const toggleDropdown = (userId) => {
        setSelectedUser(selectedUser === userId ? null : userId);
    };

    const handleEdit = (user, e) => {
        e.stopPropagation();
        setEditingUser(user);
        setShowEditPopup(true);
        setSelectedUser(null);
    };

    const handleDelete = async (userId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:5000/api/user/${userId}`);
                setUsers(users.filter(user => user.user_id !== userId));
                alert("User deleted successfully!");
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            }
        }
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:5000/api/user/${editingUser.user_id}`, {
                username: editingUser.username,
                email: editingUser.email,
                phone_number: editingUser.phone_number
            });

            setUsers(users.map(user => user.user_id === editingUser.user_id ? editingUser : user));
            setShowEditPopup(false);
            alert("User updated successfully!");
        } catch (error) {
            console.error("Error updating user:", error);
            alert("Failed to update user.");
        }
    };

    return (
        <div className="manage-users">
            <div className="header-section">
                <h1>Manage Users</h1>
                <button className="add-user-btn" onClick={() => navigate("/register")}>
                    + Add New User
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Profile</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.user_id}>
                            <td>
                                <img src={user.image || "/default-user.png"} alt="User" className="profile-pic" />
                            </td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>
                            <td>{new Date(user.created_at).toLocaleDateString()}</td>
                            <td>
                                <div className="action-menu">
                                    <button onClick={() => toggleDropdown(user.user_id)}>⋮</button>
                                    {selectedUser === user.user_id && (
                                        <div className="dropdown">
                                            <button onClick={(e) => handleEdit(user, e)}>Edit</button>
                                            <button onClick={(e) => handleDelete(user.user_id, e)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditPopup && editingUser && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Edit User</h2>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={editingUser.username}
                            onChange={(e) => setEditingUser({ ...editingUser, username: e.target.value })}
                        />

                        <label>Email:</label>
                        <input
                            type="text"
                            value={editingUser.email}
                            onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                        />

                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={editingUser.phone_number}
                            onChange={(e) => setEditingUser({ ...editingUser, phone_number: e.target.value })}
                        />

                        <div className="popup-buttons">
                            <button onClick={handleSaveChanges} className="save-btn">Save Changes</button>
                            <button onClick={() => setShowEditPopup(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
