const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv").config();

const userRoutes = require("./routes/userRoutes");
const flightRoutes = require("./routes/flightRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Роутинг
app.use("/api/users", userRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/bookings", bookingRoutes);

const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL, {
  dbName: "flights",
});

const conn = mongoose.connection;
conn.once("open", () => {
  console.log("Successfully connected to database");
});
conn.on("error", () => {
  console.log("Failed to connect to database");
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Flights service is listening on port - ${PORT}`);
});
