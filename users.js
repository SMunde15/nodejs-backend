const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const {PrismaClient}= require("@prisma/client")

router.use(bodyParser.json());
router.use(cookieParser());
const prisma = new PrismaClient();



// Middleware to authenticate user
const authenticate = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) {
      console.error("Failed to authenticate token:", err);
      return res.status(401).json({ message: "Failed to authenticate token" });
    }

    req.userEmail = decoded.email;
    req.userRole = decoded.role;
    next();
  });
};


// User login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: user.email, role: user.role },
      "secret_key",
      { expiresIn: "30m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1800000, // 30 minutes
      secure: true,
      sameSite: "None", // Required for cookies with secure: true
    });

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Get user details route
router.get("/details", authenticate, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: req.userEmail, // Fetching user based on authenticated email
      },
      select: {
        id: true, // Include at least one truthy field
        email: true,
        name: true,
        age: true,
        mobile: true,
        role: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/signup", async (req, res) => {
  const { email, password, role, name, age, mobile } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({
          message: "Email already exists. Please use a different email.",
        });
    }

    // Create a new user in the database
    const newUser = await prisma.user.create({
      data: {
        email,
        password,
        role: role || "user", // Default role is user if not provided
        name,
        age: parseInt(age), // Ensure age is an integer
        mobile,
      },
    });

    // Optionally, generate a JWT token and set it in a cookie for automatic login after signup

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the user." });
  }
});

module.exports = router;
