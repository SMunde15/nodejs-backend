const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

router.use(bodyParser.json());
router.use(cookieParser());

// In-memory user data (replace with database in real application)
const users = [
  {
    email: "sourabh.munde15@gmail.com",
    password: "password",
    role: "user",
    name: "Sourabh Munde",
    age: "22",
    mobile: "7972785704",
  },
  {
    email: "sourabh.munde.18@gmail.com",
    password: "Secret@123",
    role: "admin",
    name: "Sourabh Munde",
    age: "22",
    mobile: "7972785704",
  },
];

// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  });
};

// User login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);

  if (user) {
    const token = jwt.sign(
      { email: user.email, role: user.role },
      "secret_key",
      { expiresIn: "30m" }
    ); // Token expires in 3 minutes
    res.cookie("token", token, { httpOnly: true, maxAge: 1800000 }); // Set cookie named 'token' with the JWT token
    res.json({ message: "Login successful" });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// Get user details route
router.get("/details", authenticate, (req, res) => {
  const user = users.find((u) => u.email === req.userEmail);
  if (user) {
    const { password, ...userDetails } = user; // Exclude password from user details
    res.json(userDetails);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Edit user details route
router.put("/details", authenticate, (req, res) => {
  const { name, age, mobile } = req.body;
  const userIndex = users.findIndex((u) => u.email === req.userEmail);

  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      name: name || users[userIndex].name,
      age: age || users[userIndex].age,
      mobile: mobile || users[userIndex].mobile,
    };
    res.json({ message: "User details updated successfully" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
