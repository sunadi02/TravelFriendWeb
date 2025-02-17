import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ManageRooms.css";
import defaultRoomImage from '../images/hotel_default.png';

const ManageRooms = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();
    const [rooms, setRooms] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [editingRoom, setEditingRoom] = useState(null);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [hotel, setHotel] = useState(null);

    useEffect(() => {
        if (localStorage.getItem("isAdmin") !== "true") {
            navigate("/");
        }

        axios.get(`http://localhost:5000/api/hotels/${hotelId}`)
            .then(response => setHotel(response.data))
            .catch(error => console.error("Error fetching hotel details:", error));

        axios.get(`http://localhost:5000/api/rooms/${hotelId}`)
            .then(response => setRooms(response.data.rooms))
            .catch(error => console.error("Error fetching rooms:", error));
    }, [navigate, hotelId]);

    const toggleDropdown = (roomId) => {
        setSelectedRoom(selectedRoom === roomId ? null : roomId);
    };

    const handleEdit = (room, e) => {
        e.stopPropagation();
        setEditingRoom(room);
        setShowEditPopup(true);
        setSelectedRoom(null);
    };

    const handleDelete = async (roomId, e) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this room?")) {
            try {
                await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
                setRooms(rooms.filter(room => room.room_id !== roomId));
                alert("Room deleted successfully!");
            } catch (error) {
                console.error("Error deleting room:", error);
                alert("Failed to delete room.");
            }
        }
    };

    const handleSaveChanges = async () => {
        try {
            await axios.put(`http://localhost:5000/api/rooms/${editingRoom.room_id}`, {
                room_type: editingRoom.room_type,
                price_per_night: editingRoom.price_per_night,
                availability: editingRoom.availability
            });

            setRooms(rooms.map(room => room.room_id === editingRoom.room_id ? editingRoom : room));
            setShowEditPopup(false);
            alert("Room updated successfully!");
        } catch (error) {
            console.error("Error updating room:", error);
            alert("Failed to update room.");
        }
    };

    return (
        <div className="manage-rooms">
            <div className="header-section">
                <h1>Manage Rooms - {hotel?.hotel_name}</h1>
                <button className="add-room-btn" onClick={() => navigate(`/add-room/${hotelId}`)}>
                    + Add New Room
                </button>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Room Type</th>
                        <th>Price (LKR)</th>
                        <th>Availability</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.room_id}>
                            <td>
                                <img src={room.image ? `http://localhost:5000/uploads/${room.image}` : defaultRoomImage} alt="Room" className="room-pic" />
                            </td>
                            <td>{room.room_type}</td>
                            <td>{room.price_per_night}</td>
                            <td>{room.availability ? "Available" : "Not Available"}</td>
                            <td>
                                <div className="action-menu">
                                    <button onClick={() => toggleDropdown(room.room_id)}>⋮</button>
                                    {selectedRoom === room.room_id && (
                                        <div className="dropdown">
                                            <button onClick={(e) => handleEdit(room, e)}>Edit</button>
                                            <button onClick={(e) => handleDelete(room.room_id, e)}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showEditPopup && editingRoom && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h2>Edit Room</h2>
                        <label>Room Type:</label>
                        <input
                            type="text"
                            value={editingRoom.room_type}
                            onChange={(e) => setEditingRoom({ ...editingRoom, room_type: e.target.value })}
                        />

                        <label>Price Per Night:</label>
                        <input
                            type="number"
                            value={editingRoom.price_per_night}
                            onChange={(e) => setEditingRoom({ ...editingRoom, price_per_night: e.target.value })}
                        />

                        <label>Availability:</label>
                        <select
                            value={editingRoom.availability}
                            onChange={(e) => setEditingRoom({ ...editingRoom, availability: e.target.value })}
                        >
                            <option value="1">Available</option>
                            <option value="0">Not Available</option>
                        </select>

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

export default ManageRooms;
