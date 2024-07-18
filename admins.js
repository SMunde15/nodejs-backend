// admins.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// In-memory admin data (replace with database in real application)
const admins = [
  {
    email: "sourabh.munde.18@gmail.com",
    password: "Secret@123",
    role: "admin",
    name: "Sourabh Munde",
    age: "22",
    mobile: "7972785704",
  },
];

// Admin login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const admin = admins.find(
    (a) => a.email === email && a.password === password
  );

  if (admin) {
    const token = jwt.sign(
      { email: admin.email, role: "admin" },
      "secret_key",
      { expiresIn: "30m" }
    ); // Token expires in 3 minutes
    res.cookie("token", token, { httpOnly: true, maxAge: 1800000 }); // Set cookie named 'token' with the JWT token
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});



// Middleware to verify admin JWT token from cookie
function verifyAdminTokenFromCookie(req, res, next) {
  const token = req.cookies.token; // Retrieve token from cookie
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err || decoded.role !== "admin")
      return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
}

module.exports = router;
