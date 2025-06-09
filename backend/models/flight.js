const mongoose = require("mongoose");

const FlightSchema = new mongoose.Schema(
  {
    flightNumber: { type: String, required: true },
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    departureTime: { type: Date, required: true },
    arrivalTime: { type: Date, required: true },
    price: { type: Number, required: true },
    seatsAvailable: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", FlightSchema);
