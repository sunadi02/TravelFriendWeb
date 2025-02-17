import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManageGuides.css";
import pp from '../images/pp.png';

const ManageGuides = () => {
    const navigate = useNavigate();
    const [guides, setGuides] = useState([]);
    const [selectedGuide, setSelectedGuide] = useState(null);
    const [editingGuide, setEditingGuide] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/");
        }

        axios.get("http://localhost:5000/api/guides")
            .then(response => setGuides(response.data.guides))
            .catch(error => console.error("Error fetching guides:", error));
    }, [navigate]);

    const toggleDropdown = (guideId) => {
        setSelectedGuide(selectedGuide === guideId ? null : guideId);
    };

    const handleEdit = (guide, e) => {
        e.stopPropagation();
        setEditingGuide(guide);
        setShowEditPopup(true);
        setSelectedGuide(null);
    };

    const handleDelete = async (guideId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this guide?")) {
            try {
                await axios.delete(`http://localhost:5000/api/guides/${guideId}`);
                setGuides(guides.filter(guide => guide.guide_id !== guideId));
                alert("Guide deleted successfully!");
            } catch (error) {
                console.error("Error deleting guide:", error);
                alert("Failed to delete guide.");
            }
        }
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:5000/api/guide/${editingGuide.guide_id}`, {
                username: editingGuide.username,
                email: editingGuide.email,
                phone_number: editingGuide.phone_number
            });

            setGuides(guides.map(guide => guide.guide_id === editingGuide.guide_id ? editingGuide : guide));
            setShowEditPopup(false);
            alert("Guide updated successfully!");
        } catch (error) {
            console.error("Error updating guide:", error);
            alert("Failed to update guide.");
        }
    };

    return (
        <div className="manage-guides">
            <div className="header-section">
                <h1>Manage Guides</h1>
                <button className="add-guide-btn" onClick={() => navigate("/add-guide")}>
                    + Add New Guide
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
                    {guides.map((guide) => (
                        <tr key={guide.guide_id}>
                            <td>
                                <img src={guide.profile_pic || pp} alt="Guide" className="profile-pic" />
                            </td>
                            <td>{guide.username}</td>
                            <td>{guide.email}</td>
                            <td>{guide.phone_number}</td>
                            <td>{new Date(guide.created_at).toLocaleDateString()}</td>
                            <td>
                                <div className="action-menu">
                                    <button onClick={() => toggleDropdown(guide.guide_id)}>⋮</button>
                                    {selectedGuide === guide.guide_id && (
                                        <div className="dropdown">
                                            <button onClick={(e) => handleEdit(guide, e)}>Edit</button>
                                            <button onClick={(e) => handleDelete(guide.guide_id, e)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditPopup && editingGuide && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Edit Guide</h2>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={editingGuide.username}
                            onChange={(e) => setEditingGuide({ ...editingGuide, username: e.target.value })}
                        />

                        <label>Email:</label>
                        <input
                            type="text"
                            value={editingGuide.email}
                            onChange={(e) => setEditingGuide({ ...editingGuide, email: e.target.value })}
                        />

                        <label>Phone Number:</label>
                        <input
                            type="text"
                            value={editingGuide.phone_number}
                            onChange={(e) => setEditingGuide({ ...editingGuide, phone_number: e.target.value })}
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

export default ManageGuides;
