// admins.js

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// In-memory admin data (replace with database in real application)

// Admin login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin in MongoDB
    const admin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    // Check if admin exists and password matches
    if (admin && admin.password === password) {
      // Generate JWT token
      const token = jwt.sign(
        { email: admin.email, role: admin.role },
        "secret_key",
        { expiresIn: "30m" }
      );

      // Set HTTP-only cookie with token
      res.cookie("token", token, { httpOnly: true, maxAge: 1800000 });

      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/add", async (req, res) => {
  const { email, password, role, name, age, mobile } = req.body;

  try {
    // Check if admin with same email already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: {
        email: email,
      },
    });

    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    // Create new admin in MongoDB
    const newAdmin = await prisma.admin.create({
      data: {
        email,
        password,
        role,
        name,
        age,
        mobile,
      },
    });

    res.status(201).json({ message: "Admin added successfully", admin: newAdmin });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ message: "Internal server error" });
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
