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
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Search and filter options
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOption, setFilterOption] = useState("username"); // Default filter by username

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/");
        }

        axios.get("http://localhost:5000/api/users")
            .then(response => setUsers(response.data.users))
            .catch(error => console.error("Error fetching users:", error));
    }, [navigate]);

    // Function to filter users based on selected criteria
    const filteredUsers = users.filter(user => {
        const value = filterOption === "created_at"
            ? new Date(user.created_at).toLocaleDateString()
            : user[filterOption]?.toLowerCase() || "";

        return value.includes(searchTerm.toLowerCase());
    });

    const toggleDropdown = (userId) => {
        setSelectedUser(selectedUser === userId ? null : userId);
    };

    const handleEdit = (user, e) => {
        e.stopPropagation();
        setEditingUser(user);
        setPreviewImage(user.image || "/default-user.png");
        setShowEditPopup(true);
        setSelectedUser(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewProfilePic(file);
        setPreviewImage(URL.createObjectURL(file)); // Show image preview
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
        const formData = new FormData();
        formData.append("username", editingUser.username);
        formData.append("email", editingUser.email);
        formData.append("phone_number", editingUser.phone_number);

        if (newProfilePic) {
            formData.append("image", newProfilePic);
        }

        try {
            await axios.put(`http://localhost:5000/api/user/${editingUser.user_id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setUsers(users.map(user => user.user_id === editingUser.user_id ? { ...editingUser, image: previewImage } : user));
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

            {/* Search and Filter Section */}
            <div className="search-filter">
                <input
                    type="text"
                    placeholder={`Search by ${filterOption.replace("_", " ")}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
                    <option value="username">Username</option>
                    <option value="email">Email</option>
                    <option value="created_at">Created Date</option>
                </select>
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
                    {filteredUsers.map((user) => (
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

                        <div className="profile-edit-section">
                            <label>Profile Picture:</label>
                            <img src={previewImage} alt="Profile Preview" className="profile-preview" />
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </div>

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
