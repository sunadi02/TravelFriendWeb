const mysql = require("mysql2");
require("dotenv").config();

// Create the MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'webapp'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error("Database connection failed: " + err.stack);
        return;
    }
    console.log(`Connected to the MySQL database '${process.env.DB_NAME}'!`);
});

// Export the connection
module.exports = db;
