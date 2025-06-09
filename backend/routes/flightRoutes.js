const express = require("express");
const router = express.Router();

const Flight = require("../models/flight");
const authMiddleware = require("../middleware/auth");

// Middleware для перевірки ролі адміністратора
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied: Admins only" });
  }
  next();
}

// Отримати всі рейси — доступно ВСІМ (без авторизації)
router.get("/", async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Додати новий рейс — ТІЛЬКИ АДМІН
router.post("/", authMiddleware(), adminOnly, async (req, res) => {
  console.log("POST /api/flights - body:", req.body); // 1. Перевір вхідні дані

  try {
    const flight = new Flight(req.body);
    await flight.save();
    console.log("Flight saved:", flight); // 2. Успіх
    res.status(201).json(flight);
  } catch (err) {
    console.error("Error creating flight:", err.message); // 3. Помилка
    res
      .status(400)
      .json({ message: "Error creating flight", error: err.message });
  }
});

// Оновити інформацію про рейс — ТІЛЬКИ АДМІН
router.put("/:id", authMiddleware(), adminOnly, async (req, res) => {
  console.log("Received PUT body:", req.body);

  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("Received PUT body:", req.body);

    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.json(flight);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating flight", error: err.message });
  }
});

// Видалити рейс — ТІЛЬКИ АДМІН
router.delete("/:id", authMiddleware(), adminOnly, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: "Flight not found" });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
