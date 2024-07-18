const { Prisma, PrismaClient } = require("@prisma/client");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();



let nextBookingId = 0;
let userBookings = [];
let lastBookingId = 0; 


const generateSequentialBookingId = () => {
  const id = nextBookingId;
  nextBookingId = (nextBookingId + 1) % 101; // Ensure IDs wrap around from 0 to 100
  return id.toString(); // Convert to string to match UUID format for consistency
};

const verifyTokenFromCookie = (req, res, next) => {
  const token = req.cookies.token; // Retrieve token from cookie
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, "secret_key", (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    req.user = decoded;
    next();
  });
};

router.get("/", async (req, res) => {
  try {
    const trains = await prisma.train.findMany({
      include: {
        routePoints: true,
        fare: true,
      },
    });
    res.json(trains);
  } catch (error) {
    console.error("Error fetching trains:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/add", verifyTokenFromCookie, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const { trainName, trainNumber, dateOfAvailability, routePoints, fare } =
    req.body;

  try {
    // Create the new train with related route points and fare
    const newTrain = await prisma.train.create({
      data: {
        trainName,
        trainNumber,
        dateOfAvailability,
        routePoints: {
          create: routePoints,
        },
        fare: {
          create: fare,
        },
      },
      include: {
        routePoints: true,
        fare: true,
      },
    });

    res.json({ message: "Train added successfully", train: newTrain });
  } catch (error) {
    console.error("Error adding train:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Confirm ticket and decrease available seats

// Confirm ticket and decrease available seats
router.post("/confirm-ticket", verifyTokenFromCookie, async (req, res) => {
  const { train_number, passengers } = req.body;

  try {
    // Find the train by train_number
    const selectedTrain = await prisma.train.findFirst({
      where: {
        trainNumber: train_number,
      },
      include: {
        routePoints: true,
      },
    });

    if (!selectedTrain) {
      return res.status(404).json({ message: "Train not found" });
    }

    // Calculate total number of seats to be booked
    const totalSeatsBooked = passengers.length;

    // Check if there are enough available seats
    if (selectedTrain.routePoints[0].availableSeats < totalSeatsBooked) {
      return res.status(400).json({ message: "Not enough available seats" });
    }

    // Update available seats in the database
    await prisma.routePoint.update({
      where: {
        id: selectedTrain.routePoints[0].id,
      },
      data: {
        availableSeats: {
          decrement: totalSeatsBooked,
        },
      },
    });

    // Generate a new sequential bookingId
    const bookingId = generateSequentialBookingId();
    const newBookings = [];

    // Store booking information in MongoDB
    passengers.forEach((passenger, index) => {
      const bookingId = generateSequentialBookingId();
      newBookings.push(
        prisma.booking.create({
          data: {
            bookingId,
            name: passenger.name,
            age: Number(passenger.age), // Convert age to number
            gender: passenger.gender,
            trainName: selectedTrain.trainName,
            trainNumber: selectedTrain.trainNumber,
            email: req.user.email, // Use req.user.email to get user's email
            user: {
              connect: {
                email: req.user.email, // Replace with actual userId or logic to retrieve userId
              },
            },
          },
        })
      );
    });
    await Promise.all(newBookings);
    res.json({ message: "Ticket booked successfully", bookingId });
  } catch (error) {
    console.error("Error booking ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// GET /bookings endpoint
router.get("/bookings", verifyTokenFromCookie, async (req, res) => {
  try {
    const userBookings = await prisma.booking.findMany();
    res.json(userBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /bookings/:bookingId endpoint
router.delete(
  "/bookings/:bookingId",
  verifyTokenFromCookie,
  async (req, res) => {
    const { bookingId } = req.params;

    try {
      // Delete the booking from MongoDB
      await prisma.booking.delete({
        where: {
          bookingId,
        },
      });

      res.json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
