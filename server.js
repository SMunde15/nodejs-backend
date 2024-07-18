// server.js

// Import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Create Express app
const app = express();
const PORT = 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001", // Allow requests from this origin
    credentials: true, // Allow credentials (cookies) to be sent
  })
);

// Middleware to verify JWT token from cookie
function verifyTokenFromCookie(req, res, next) {
  const token = req.cookies.token; // Retrieve token from cookie
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
}

// Routes setup
app.use("/users", require("./users"));
app.use("/admins", require("./admins"));
app.use("/trains", verifyTokenFromCookie, require("./trains"));

// Protected route example
app.get("/protected", verifyTokenFromCookie, (req, res) => {
  res.json({ message: "Protected endpoint accessed successfully" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
