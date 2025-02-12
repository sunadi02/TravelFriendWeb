import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api", // Your backend base URL
});

// Add a request interceptor to include the token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Authentication APIs
export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const resetPassword = (data) => API.post("/reset-password", data);
export const forgotPassword = (data) => API.post("/forgot-password", data); // Add this line

// Booking APIs
export const getBookings = () => API.get("/bookings/1"); // Replace '1' with the user ID if needed
export const createBooking = (data) => API.post("/bookings", data);
export const deleteBooking = (id) => API.delete(`/bookings/${id}`);

// Export the instance for custom requests
export default API;
