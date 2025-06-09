import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://flight-booking-1-2gzk.onrender.com/api/bookings/my-bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
        alert("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `https://flight-booking-1-2gzk.onrender.com/api/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to cancel booking");

      alert("Booking cancelled");

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error cancelling booking");
    }
  };

  const formatDateTime = (str) => {
    if (!str) return "N/A";
    return new Date(str).toLocaleString();
  };

  return (
    <main className="max-w-5xl mx-auto px-6 py-16 pt-28">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        My Bookings
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">You have no bookings yet.</p>
      ) : (
        <ul className="space-y-6">
          {bookings.map((booking) => {
            const flight = booking.flight;
            return (
              <li
                key={booking._id}
                className="border p-6 rounded-md shadow-sm hover:shadow transition"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-700">
                      {flight.from} → {flight.to}
                    </h2>
                    <p className="text-gray-600">{flight.airline}</p>
                    <p className="text-sm text-gray-500">
                      <strong>Status:</strong>{" "}
                      <span
                        className={
                          booking.status === "cancelled"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        {booking.status}
                      </span>
                    </p>
                    {booking.status !== "cancelled" && (
                      <button
                        onClick={() => cancelBooking(booking._id)}
                        className="mt-2 text-red-600 hover:underline text-sm"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                  <div className="text-gray-700 text-sm md:text-base">
                    <p>
                      <strong>Departure:</strong>{" "}
                      {formatDateTime(flight.departureTime)}
                    </p>
                    <p>
                      <strong>Arrival:</strong>{" "}
                      {formatDateTime(flight.arrivalTime)}
                    </p>
                    <p>
                      <strong>Seats Booked:</strong> {booking.seatsBooked}
                    </p>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    Total: ${flight.price * booking.seatsBooked}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
};

export default MyBookings;
