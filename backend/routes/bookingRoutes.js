const express = require("express");
const router = express.Router();

const Booking = require("../models/booking");
const Flight = require("../models/flight");
const authMiddleware = require("../middleware/auth");

// Перевірка, чи користувач — адмін
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
};

// Створити бронювання — тільки залогінений користувач
router.post("/", authMiddleware(), async (req, res) => {
  try {
    const { flightId, seatsBooked } = req.body;

    const flight = await Flight.findById(flightId);
    if (!flight) return res.status(404).json({ message: "Flight not found" });

    if (flight.seatsAvailable < seatsBooked) {
      return res.status(400).json({ message: "Not enough seats available" });
    }

    const booking = new Booking({
      user: req.user.id,
      flight: flightId,
      seatsBooked,
    });
    await booking.save();

    flight.seatsAvailable -= seatsBooked;
    await flight.save();

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Отримати бронювання поточного користувача — тільки для залогінених
router.get("/my-bookings", authMiddleware(), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "flight"
    );
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Отримати всі бронювання — тільки адмін
router.get("/all", authMiddleware(), adminOnly, async (req, res) => {
  console.log("Admin route accessed");
  console.log("User in admin route:", req.user);

  try {
    const bookings = await Booking.find().populate("flight user");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Видалити бронювання — власник або адмін
router.delete("/:id", authMiddleware(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Якщо не адмін і не власник бронювання — відмовити
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.seatsAvailable += booking.seatsBooked;
      await flight.save();
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/:id/cancel", authMiddleware(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Можна додати перевірку: чи належить booking цьому користувачу
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
