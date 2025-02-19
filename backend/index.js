
const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || "default_secret";

const app = express();
const multer = require("multer");
const storage = multer.diskStorage({
    destination: "./uploads", // Folder where images will be stored
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const path = require("path");
const upload = multer({ storage });

app.use(cors({
    origin: "http://localhost:3000", // Set specific frontend origin
    credentials: true, // Allow credentials (cookies, authorization headers)
}));

app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.get("/api/test", (req, res) => {
    res.json({ message: "Hello from the backend!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// User Login
app.post("/api/user/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid password." });
        }

        const token = { user_id: user.user_id };
        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.email,
                user_name: user.user_name,
                role: "user"
            }
        });
    });
});

// Admin Login
app.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;

    const query = "SELECT * FROM admins WHERE username = ? AND password_hash = ?";
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const admin = results[0];

        res.status(200).json({
            message: "Login successful!",
            token: { admin_id: admin.admin_id },
            admin: {
                id: admin.admin_id,
                username: admin.username,
                role: "admin"
            }
        });
    });
});


app.post("/admin/add", (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const query = "INSERT INTO admins (username, email, password_hash, created_at) VALUES (?, ?, ?, NOW())";

    db.query(query, [username, email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: "Database error", details: err });
        }

        res.json({ success: true, message: "Admin added successfully", admin_id: result.insertId });
    });
});


app.get("/api/admin/:id", (req, res) => {
    const adminId = req.params.id;

    const query = "SELECT * FROM admins WHERE admin_id = ?";
    db.query(query, [adminId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.json(results[0]);
    });
});


// GET: Fetch admin dashboard statistics (total users & total bookings)
app.get("/api/admins/stats", (req, res) => {
    const usersQuery = "SELECT COUNT(*) AS totalUsers FROM users";
    const bookingsQuery = "SELECT COUNT(*) AS totalBookings FROM bookings";

    db.query(usersQuery, (err, userResults) => {
        if (err) {
            console.error("Database error (users):", err);
            return res.status(500).json({ error: "Failed to fetch total users." });
        }

        db.query(bookingsQuery, (err, bookingResults) => {
            if (err) {
                console.error("Database error (bookings):", err);
                return res.status(500).json({ error: "Failed to fetch total bookings." });
            }

            // Send the stats response
            res.status(200).json({
                totalUsers: userResults[0].totalUsers,
                totalBookings: bookingResults[0].totalBookings,
            });
        });
    });
});



// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS // Your email password (use app-specific password if 2FA enabled)
    }
});

// Generate a 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP temporarily (in-memory for simplicity)
const otps = {};

app.post("/api/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error("Database query failed:", err);
            return res.status(500).json({ error: "Server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Email not found." });
        }

        const otp = generateOTP();
        otps[email] = otp;

        // Send OTP email
        const mailOptions = {
            from: 'travelfriendweb@gmail.com',
            to: email,
            subject: 'Your OTP for Password Reset',
            text: `Your OTP code is ${otp}. It will expire in 10 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Failed to send email:", error);
                return res.status(500).json({ error: "Failed to send OTP email." });
            }
            console.log('Email sent:', info.response); // Log the response
            res.status(200).json({ message: "OTP sent to your email." });
        });
    });
});

app.get("/api/user", (req, res) => {
    if (req.session.user) {
      const userId = req.session.user.user_id;
      const sql = "SELECT * FROM users WHERE user_id = ?";
      db.query(sql, [userId], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Failed to fetch user." });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ error: "User not found." });
        }
  
        let user = results[0];
        user.image = user.image ? `http://localhost:5000/uploads/${user.image}` : null;
  
        res.status(200).json(user);
      });
    } else {
      res.status(401).json({ error: "User not authenticated." });
    }
  });
  

app.get("/api/users", (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch users." });
        }

        const users = results.map(user => ({
            ...user,
            image: user.image ? `http://localhost:5000/uploads/${user.image}` : null
        }));

        res.status(200).json({ users });
    });
});

app.get("/api/user/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT * FROM users WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch user." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        let user = results[0];
        res.status(200).json(user);
    });
});


// ✅ **PUT (Update User)**
app.put("/api/user/:id", upload.single("image"), async (req, res) => {
    const userId = req.params.id;
    const { username, email, password, user_name, phone_number } = req.body;
    
    let updateFields = [];
    let values = [];

    if (username) {
        updateFields.push("username = ?");
        values.push(username);
    }
    if (email) {
        updateFields.push("email = ?");
        values.push(email);
    }
    if (password) {
        const passwordHash = await bcrypt.hash(password, 10);
        updateFields.push("password_hash = ?");
        values.push(passwordHash);
    }
    if (user_name) {
        updateFields.push("user_name = ?");
        values.push(user_name);
    }
    if (phone_number) {
        updateFields.push("phone_number = ?");
        values.push(phone_number);
    }
    if (req.file) {
        updateFields.push("image = ?");
        values.push(req.file.filename);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    values.push(userId);
    const sql = `UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to update user profile." });
        }
        res.status(200).json({ message: "Profile updated successfully!" });
    });
});


// ✅ **DELETE User**
app.delete("/api/user/:id", (req, res) => {
    const userId = req.params.id;
    const query = "DELETE FROM users WHERE user_id = ?";

    db.query(query, [userId], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });
        res.json({ message: "User deleted successfully" });
    });
});

// Endpoint to verify OTP and reset password
app.post("/api/reset-password", async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (otps[email] !== otp) {
        return res.status(400).json({ error: "Invalid OTP." });
    }

    try {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in the database
        const sql = "UPDATE users SET password_hash = ? WHERE email = ?";
        db.query(sql, [hashedPassword, email], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Failed to reset password." });
            }

            // Remove OTP from temporary storage
            delete otps[email];

            res.status(200).json({ message: "Password reset successfully!" });
        });
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});

// Registration Endpoint
app.post("/api/register", async (req, res) => {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email)) {
        return res.status(400).json({ error: "Invalid email format." });
    }

    try {
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user into the database
        const sql = `
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        `;
        db.query(
            sql,
            [username, email, hashedPassword],
            (err, result) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(400).json({ error: "Username or email already exists." });
                    }
                    return res.status(500).json({ error: "Database error." });
                }
                res.status(201).json({ message: "User registered successfully!" });
            }
        );
    } catch (err) {
        res.status(500).json({ error: "Server error." });
    }
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        return res.status(403).json({ error: "No token provided." });
    }

    const SECRET_KEY = "your_secret_key";
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token." });
        }
        req.userId = decoded.user_id; // Attach user ID to the request
        next();
    });
}


// Example protected route
app.get("/api/protected", (req, res) => {
    res.status(200).json({ message: "Access granted!", userId: req.userId });
});





/**
 * 🏨 GET All Hotels - Fetch all hotels
 */
app.get("/api/hotels", (req, res) => {
    const sql = "SELECT * FROM hotels";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch hotels." });
        }

        const hotels = results.map(hotel => ({
            ...hotel,
            image: hotel.image ? `http://localhost:5000/uploads/${hotel.image}` : null
        }));

        res.status(200).json({ hotels });
    });
});

/**
 * 🏨 GET a Single Hotel - Fetch a hotel by ID
 */
app.get("/api/hotels/:id", (req, res) => {
    const hotelId = req.params.id;
    const sql = "SELECT * FROM hotels WHERE hotel_id = ?";

    db.query(sql, [hotelId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch hotel." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Hotel not found." });
        }

        let hotel = results[0];
        hotel.image = hotel.image ? `http://localhost:5000/uploads/${hotel.image}` : null;

        res.status(200).json(hotel);
    });
});

/**
 * 🏨 POST Add a New Hotel
 */
app.post("/api/hotels", upload.single("image"), async (req, res) => {
    const { username, email, password, hotel_name, location, price_range, phone_number, ratings, description, latitude, longitude } = req.body;

    if (!username || !email || !password || !hotel_name || !description || !location || !price_range || !phone_number ) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const image = req.file ? req.file.filename : "default-hotel.jpg";

        const sql = `INSERT INTO hotels (username, email, password_hash, hotel_name, location, price_range, description, phone_number, ratings, image, latitude, longitude, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;

        const values = [username, email, hashedPassword, hotel_name, location, price_range, description || "Unknown", phone_number, ratings || 5, image, latitude, longitude];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Failed to add hotel." });
            }
            res.status(201).json({ message: "Hotel added successfully!", hotelId: result.insertId });
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: "Server error." });
    }
});

/**
 * 🏨 PUT Update Hotel Details
 */
app.put("/api/hotels/:id", upload.single("image"), (req, res) => {
    const hotelId = req.params.id;
    const { hotel_name, location, description, price_range, phone_number, ratings, latitude, longitude } = req.body;

    let updateFields = [];
    let values = [];

    if (hotel_name) {
        updateFields.push("hotel_name = ?");
        values.push(hotel_name);
    }
    if (location) {
        updateFields.push("location = ?");
        values.push(location);
    }
    if (price_range) {
        updateFields.push("price_range = ?");
        values.push(price_range);
    }
    if (phone_number) {
        updateFields.push("phone_number = ?");
        values.push(phone_number);
    }
    if (description) {
        updateFields.push("description = ?");
        values.push(description);
    }
    if (ratings) {
        updateFields.push("ratings = ?");
        values.push(ratings);
    }
    if (latitude) {
        updateFields.push("latitude = ?");
        values.push(latitude);
    }
    if (longitude) {
        updateFields.push("longitude = ?");
        values.push(longitude);
    }
    if (req.file) {
        updateFields.push("image = ?");
        values.push(req.file.filename);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    values.push(hotelId);
    const sql = `UPDATE hotels SET ${updateFields.join(", ")} WHERE hotel_id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to update hotel." });
        }
        res.status(200).json({ message: "Hotel updated successfully!" });
    });
});

/**
 * 🏨 DELETE Remove a Hotel
 */
app.delete("/api/hotels/:id", (req, res) => {
    const hotelId = req.params.id;
    const sql = "DELETE FROM hotels WHERE hotel_id = ?";

    db.query(sql, [hotelId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to delete hotel." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Hotel not found." });
        }

        res.status(200).json({ message: "Hotel deleted successfully!" });
    });
});

app.post("/api/send-confirmation", async (req, res) => {
    const { guideId, price, selectedDate, duration, email } = req.body;

    const mailOptions = {
        from: "travelfriendweb@gmail.com",
        to: email,
        subject: "Guide Booking Confirmation",
        text: `Your booking for Guide ID ${guideId} is confirmed!\nDate: ${selectedDate}\nDuration: ${duration} days\nTotal Price: LKR ${price}.`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Confirmation email sent!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to send email." });
    }
});


// Payment processing route
app.post("/api/paymentinfo", async (req, res) => {
    const { user_id, card_number, expiry_date, cvc, card_holder, save_card, selectedDate } = req.body;

    if (!user_id || !card_number || !expiry_date || !cvc || !card_holder) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    try {
        // Hash CVC for security
        const hashedCVC = await bcrypt.hash(cvc, 10);

        // Insert payment details into DB
        const sql = `
            INSERT INTO paymentinfo (user_id, card_number, expiry_date, cvc_hash, card_holder, save_card, booking_date) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [user_id, card_number, expiry_date, hashedCVC, card_holder, save_card, selectedDate];

        db.query(sql, values, (err) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Payment failed." });
            }

            res.status(201).json({ success: true, message: "Payment successful. Booking confirmed!" });
        });
    } catch (error) {
        console.error("Payment error:", error);
        res.status(500).json({ error: "Server error." });
    }
});

app.get("/api/paymentinfo/:id", (req, res) => {
    const userId = req.params.id;
    const sql = "SELECT * FROM paymentinfo WHERE user_id = ?";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch payment info." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "No payment info found for this user." });
        }

        // Masking card details for security (show only last 4 digits)
        const maskedPayments = results.map(payment => ({
            paymentinfo_id: payment.paymentinfo_id,
            user_id: payment.user_id,
            card_holder: payment.card_holder,
            card_number: `**** **** **** ${payment.card_number.slice(-4)}`,
            expiry_date: payment.expiry_date,
            save_card: payment.save_card,
            booking_date: payment.booking_date
        }));

        res.status(200).json({ cards: maskedPayments });
    });
});





// POST API to add a new guide
app.post("/api/guides", upload.single("profile_pic"), async (req, res) => {
    const {
        username,
        email,
        password,
        guide_name,
        phone_number,
        languages,
        hourly_rate,
        rating,
        description,
    } = req.body;

    if (!username || !email || !password || !guide_name || !phone_number) {
        return res.status(400).json({ error: "Required fields are missing." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const profile_pic = req.file ? req.file.filename : "default.jpg"; // Default image if not uploaded

        const sql = `INSERT INTO guides (username, email, password_hash, guide_name, profile_pic, phone_number, languages, hourly_rate, rating, description, created_at) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        const values = [
            username,
            email,
            hashedPassword,
            guide_name,
            profile_pic,
            phone_number,
            languages || "",
            hourly_rate || 0,
            rating || 5,
            description || "",
        ];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Failed to add guide." });
            }
            res.status(201).json({ message: "Guide added successfully!", guideId: result.insertId });
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ error: "Server error." });
    }
});

app.put("/api/guides/:id", upload.single("profile_pic"), (req, res) => {
    const guideId = req.params.id;
    const { username, email, password, guide_name, phone_number, languages,location, hourly_rate, rating, description } = req.body;
    
    // Check if a new image is uploaded
    let profilePicPath = req.file ? req.file.filename : null;

    // Hash password if provided
    let updatePassword = password ? `password_hash = ?` : "";
    let passwordValue = password ? bcrypt.hashSync(password, 10) : null;

    // Construct update query dynamically
    let updateFields = [];
    let values = [];

    if (username) {
        updateFields.push("username = ?");
        values.push(username);
    }
    if (email) {
        updateFields.push("email = ?");
        values.push(email);
    }
    if (updatePassword) {
        updateFields.push(updatePassword);
        values.push(passwordValue);
    }
    if (guide_name) {
        updateFields.push("guide_name = ?");
        values.push(guide_name);
    }
    if (phone_number) {
        updateFields.push("phone_number = ?");
        values.push(phone_number);
    }
    if (languages) {
        updateFields.push("languages = ?");
        values.push(languages);
    }
    if(location){
        updateFields.push("location = ?");
        values.push(location);
    }
    if (hourly_rate) {
        updateFields.push("hourly_rate = ?");
        values.push(hourly_rate);
    }
    if (rating) {
        updateFields.push("rating = ?");
        values.push(rating);
    }
    if (description) {
        updateFields.push("description = ?");
        values.push(description);
    }
    if (profilePicPath) {
        updateFields.push("profile_pic = ?");
        values.push(profilePicPath);
    }

    // If there are no fields to update
    if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    values.push(guideId); // Add guide ID at the end

    const sql = `UPDATE guides SET ${updateFields.join(", ")} WHERE guide_id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to update guide." });
        }

        res.status(200).json({ message: "Guide updated successfully!" });
    });
});

// ✅ DELETE Guide by ID
app.delete("/api/guides/:id", (req, res) => {
    const guideId = req.params.id;
    const sql = "DELETE FROM guides WHERE guide_id = ?";

    db.query(sql, [guideId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to delete guide." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Guide not found." });
        }

        res.status(200).json({ message: "Guide deleted successfully!" });
    });
});


app.get("/api/guides", (req, res) => {
    const sql = "SELECT * FROM guides";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch guides." });
        }

        // Update image paths if needed
        const guides = results.map(guide => ({
            ...guide,
            profile_pic: guide.profile_pic ? `http://localhost:5000/uploads/${guide.profile_pic}` : null
        }));

        res.status(200).json({ guides });
    });
});

app.get("/api/guides/:id", (req, res) => {
    const guideId = req.params.id;
    const sql = "SELECT * FROM guides WHERE guide_id = ?";

    db.query(sql, [guideId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch guide." });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Guide not found." });
        }

        let guide = results[0];
        guide.profile_pic = guide.profile_pic ? `http://localhost:5000/uploads/${guide.profile_pic}` : null;

        res.status(200).json(guide);
    });
});
  
  
  // Get all rooms
  app.get("/api/rooms", (req, res) => {
    db.query("SELECT * FROM rooms", (err, results) => {
      if (err) {
        console.error("Error fetching rooms:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ rooms: results });
    });
  });
  
  // Get rooms by hotel_id
  app.get("/api/rooms/:hotel_id", (req, res) => {
    const { hotel_id } = req.params;
    db.query("SELECT * FROM rooms WHERE hotel_id = ?", [hotel_id], (err, results) => {
      if (err) {
        console.error("Error fetching rooms:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ rooms: results });
    });
  });
  
  // Add a new room (with image upload)
  app.post("/api/rooms", upload.single("image"), (req, res) => {
    const { hotel_id, room_type, price_per_night, availability } = req.body;
    const image = req.file ? req.file.filename : null; // Store image filename
  
    db.query(
      "INSERT INTO rooms (hotel_id, room_type, image, price_per_night, availability) VALUES (?, ?, ?, ?, ?)",
      [hotel_id, room_type, image, price_per_night, availability],
      (err, result) => {
        if (err) {
          console.error("Error adding room:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Room added successfully", room_id: result.insertId });
      }
    );
  });
  
  // Update room details
  app.put("/api/rooms/:room_id", upload.single("image"), (req, res) => {
    const { room_id } = req.params;
    const { room_type, price_per_night, availability } = req.body;
    const image = req.file ? req.file.filename : req.body.image; // Keep old image if not updated
  
    db.query(
      "UPDATE rooms SET room_type = ?, image = ?, price_per_night = ?, availability = ? WHERE room_id = ?",
      [room_type, image, price_per_night, availability, room_id],
      (err) => {
        if (err) {
          console.error("Error updating room:", err);
          return res.status(500).json({ error: "Database error" });
        }
        res.json({ message: "Room updated successfully" });
      }
    );
  });
  
  // Delete a room
  app.delete("/api/rooms/:room_id", (req, res) => {
    const { room_id } = req.params;
    db.query("DELETE FROM rooms WHERE room_id = ?", [room_id], (err) => {
      if (err) {
        console.error("Error deleting room:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.json({ message: "Room deleted successfully" });
    });
  });

//app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.post("/api/bookings", (req, res) => {
    const { user_id, guide_id, hotel_id, room_id, total_price } = req.body;

    if (!user_id || !total_price) {
        return res.status(400).json({ error: "User ID and total price are required." });
    }

    const sql = `
        INSERT INTO bookings (user_id, guide_id, hotel_id, room_id, total_price, status, created_at)
        VALUES (?, ?, ?, ?, ?, 'Confirmed', NOW())
    `;

    db.query(sql, [user_id, guide_id, hotel_id, room_id, total_price], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to create booking." });
        }
        res.status(201).json({ message: "Booking created successfully!", bookingId: result.insertId });
    });
});


app.get("/api/bookings/:user_id", (req, res) => {
    const userId = req.params.user_id; // ✅ Get user ID from URL params

    const sql = `
        SELECT 
            bookings.*, 
            COALESCE(hotels.hotel_name, 'N/A') AS hotel_name, 
            COALESCE(rooms.room_type, 'N/A') AS room_type, 
            COALESCE(guides.guide_name, 'N/A') AS guide_name 
        FROM bookings
        LEFT JOIN hotels ON bookings.hotel_id = hotels.hotel_id
        LEFT JOIN rooms ON bookings.room_id = rooms.room_id
        LEFT JOIN guides ON bookings.guide_id = guides.guide_id
        WHERE bookings.user_id = ?;
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch bookings." });
        }
        res.status(200).json({ bookings: results });
    });
});



// GET: Fetch all bookings for the admin
app.get("/api/bookings", (req, res) => {
    const sql = `
        SELECT bookings.*, users.user_name, hotels.hotel_name, rooms.room_type, guides.guide_name
        FROM bookings
        LEFT JOIN users ON bookings.user_id = users.user_id
        LEFT JOIN hotels ON bookings.hotel_id = hotels.hotel_id
        LEFT JOIN rooms ON bookings.room_id = rooms.room_id
        LEFT JOIN guides ON bookings.guide_id = guides.guide_id
        
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch bookings." });
        }
        res.status(200).json({ bookings: results });
    });
});


// DELETE: Cancel a booking
app.delete("/api/bookings/:id", (req, res) => {
    const bookingId = req.params.id;
    const userId = req.id; // Extracted from the token

    const sql = "DELETE FROM bookings WHERE booking_id = ? AND user_id = ?";
    db.query(sql, [bookingId, userId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to cancel booking." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Booking not found or unauthorized." });
        }
        res.status(200).json({ message: "Booking canceled successfully." });
    });
});


// app.get("/api/bookings", (req, res) => {
//     const userId = req.userId; // ✅ Extracted from the token

//     const sql = `
//         SELECT bookings.*, hotels.hotel_name, rooms.room_type, guides.guide_name
//         FROM bookings
//         LEFT JOIN hotels ON bookings.hotel_id = hotels.hotel_id
//         LEFT JOIN rooms ON bookings.room_id = rooms.room_id
//         LEFT JOIN guides ON bookings.guide_id = guides.guide_id
//         WHERE bookings.user_id = ?
//     `;

//     db.query(sql, [userId], (err, results) => {
//         if (err) {
//             console.error("Database error:", err);
//             return res.status(500).json({ error: "Failed to fetch bookings." });
//         }
//         res.status(200).json({ bookings: results });
//     });
// });


// Get all places
app.get("/api/places", (req, res) => {
    db.query("SELECT * FROM places", (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch places" });
        }
        const places = results.map(place => ({
            ...place,
            image: place.image ? `http://localhost:5000/uploads/${place.image}` : null
        }));
        res.json({ places });
    });
});

// Get single place
app.get("/api/places/:id", (req, res) => {
    const placeId = req.params.id;
    db.query("SELECT * FROM places WHERE place_id = ?", [placeId], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch place" });
        }
        if (results.length === 0) return res.status(404).json({ error: "Place not found" });
        
        const place = results[0];
        place.image = place.image ? `http://localhost:5000/uploads/${place.image}` : null;
        res.json(place);
    });
});

// Route to add a new place
app.post("/api/places", upload.single("image"), (req, res) => {
    const { title, description, location } = req.body;
    const image = req.file ? req.file.filename : null; // Store image filename

    if (!title || !description || !location) {
        return res.status(400).json({ error: "All fields (title, description, location) are required." });
    }

    const sql = "INSERT INTO places (title, description, location, image) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, description, location, image], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to add place." });
        }
        res.status(201).json({ message: "Place added successfully!", placeId: result.insertId });
    });
});

app.put("/api/places/:id", upload.single("image"), (req, res) => {
    const placeId = req.params.id;
    const { title, description, location } = req.body;
    const image = req.file ? req.file.filename : null; // New image (if uploaded)

    let updateFields = [];
    let values = [];

    if (title) {
        updateFields.push("title = ?");
        values.push(title);
    }
    if (description) {
        updateFields.push("description = ?");
        values.push(description);
    }
    if (location) {
        updateFields.push("location = ?");
        values.push(location);
    }
    if (image) {
        updateFields.push("image = ?");
        values.push(image);
    }

    if (updateFields.length === 0) {
        return res.status(400).json({ error: "No fields provided for update." });
    }

    values.push(placeId);
    const sql = `UPDATE places SET ${updateFields.join(", ")} WHERE place_id = ?`;

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to update place." });
        }
        res.status(200).json({ message: "Place updated successfully!" });
    });
});




module.exports = router;