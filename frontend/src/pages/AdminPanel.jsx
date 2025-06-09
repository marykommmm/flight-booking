import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [flights, setFlights] = useState([]);
  const [flightsLoading, setFlightsLoading] = useState(true);
  const [flightsError, setFlightsError] = useState(null);

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState(null);

  const [flightForm, setFlightForm] = useState({
    flightNumber: "",
    departure: "",
    arrival: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
    seatsAvailable: 0,
  });
  const [editingFlightId, setEditingFlightId] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://flight-booking-1-2gzk.onrender.com/api/users/get-users",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUsers(response.data);
      } catch {
        setError("Failed to load users");
      }
      setLoading(false);
    };

    const fetchBookings = async () => {
      setBookingsLoading(true);
      try {
        const response = await axios.get(
          "https://flight-booking-1-2gzk.onrender.com/api/bookings/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("Bookings response:", response.data); // Тут лог даних
        setBookings(response.data);
      } catch (error) {
        setBookingsError("Failed to load bookings");
      }
      setBookingsLoading(false);
    };

    const fetchFlights = async () => {
      setFlightsLoading(true);
      try {
        const response = await axios.get("https://flight-booking-1-2gzk.onrender.com/api/flights");
        setFlights(response.data);
      } catch {
        setFlightsError("Failed to load flights");
      }
      setFlightsLoading(false);
    };

    fetchUsers();
    fetchFlights();
    fetchBookings();
  }, [user, navigate]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://flight-booking-1-2gzk.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      alert("User deleted");
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleFlightInputChange = (e) => {
    setFlightForm({ ...flightForm, [e.target.name]: e.target.value });
  };

  const handleFlightSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (editingFlightId) {
        await axios.put(
          `https://flight-booking-1-2gzk.onrender.com/api/flights/${editingFlightId}`,
          flightForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert("Flight updated");
      } else {
        await axios.post("https://flight-booking-1-2gzk.onrender.com/api/flights", flightForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Flight created");
      }

      setFlightForm({
        flightNumber: "",
        departure: "",
        arrival: "",
        departureTime: "",
        arrivalTime: "",
        price: 0,
        seatsAvailable: 0,
      });
      setEditingFlightId(null);

      const res = await axios.get("https://flight-booking-1-2gzk.onrender.com/api/flights");
      setFlights(res.data);
    } catch (err) {
      alert(
        "Error saving flight: " + (err.response?.data?.message || err.message)
      );
    }
  };

  const handleEditFlight = (flight) => {
    console.log("handleEditFlight called with:", flight);
    console.log("departureTime raw:", flight.departureTime);
    console.log("arrivalTime raw:", flight.arrivalTime);

    setFlightForm({
      flightNumber: flight.flightNumber,
      departure: flight.departure,
      arrival: flight.arrival,
      departureTime: flight.departureTime.slice(0, 16),
      arrivalTime: flight.arrivalTime.slice(0, 16),
      price: flight.price,
      seatsAvailable: flight.seatsAvailable,
    });
    setEditingFlightId(flight._id);
  };

  const handleDeleteFlight = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flight?")) return;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`https://flight-booking-1-2gzk.onrender.com/api/flights/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFlights((prev) => prev.filter((f) => f._id !== id));
      alert("Flight deleted");
    } catch {
      alert("Failed to delete flight");
    }
  };

  // Delete booking handler
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;
    const token = localStorage.getItem("token");

    try {
      await axios.delete(`https://flight-booking-1-2gzk.onrender.com/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings((prev) => prev.filter((b) => b._id !== id));
      alert("Booking deleted");
    } catch {
      alert("Failed to delete booking");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading users...</p>;
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>;

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 pt-28">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        Admin Panel
      </h1>
      {/* Users table - unchanged */}
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mb-12">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3">Name</th>
              <th className="border border-gray-300 p-3">Email</th>
              <th className="border border-gray-300 p-3">Role</th>
              <th className="border border-gray-300 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(({ _id, name, email, role }) => (
              <tr key={_id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{name}</td>
                <td className="border border-gray-300 p-3">{email}</td>
                <td className="border border-gray-300 p-3 capitalize">
                  {role}
                </td>
                <td className="border border-gray-300 p-3 text-center space-x-2">
                  <button
                    onClick={() => handleDeleteUser(_id)}
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* Flight form */}
      <h2 className="text-2xl font-semibold mb-4">Flights Management</h2>
      <form onSubmit={handleFlightSubmit} className="mb-6 space-y-3 max-w-xl">
        <input
          type="text"
          name="flightNumber"
          placeholder="Flight Number"
          value={flightForm.flightNumber}
          onChange={handleFlightInputChange}
          required
          className="input"
        />
        <input
          type="text"
          name="departure"
          placeholder="Departure"
          value={flightForm.departure}
          onChange={handleFlightInputChange}
          list="airports"
          required
          className="input"
        />
        <input
          type="text"
          name="arrival"
          placeholder="Arrival"
          value={flightForm.arrival}
          onChange={handleFlightInputChange}
          list="airports"
          required
          className="input"
        />
        <datalist id="airports">
          <option value="Kyiv" />
          <option value="Lviv" />
          <option value="Odesa" />
          <option value="Warsaw" />
          <option value="Berlin" />
          <option value="Paris" />
          <option value="New York" />
          <option value="London" />
          <option value="Dubai" />
          <option value="Tokyo" />
        </datalist>

        <label className="block">
          Departure Time:
          <input
            type="datetime-local"
            name="departureTime"
            value={flightForm.departureTime}
            onChange={handleFlightInputChange}
            required
            className="input"
          />
        </label>
        <label className="block">
          Arrival Time:
          <input
            type="datetime-local"
            name="arrivalTime"
            value={flightForm.arrivalTime}
            onChange={handleFlightInputChange}
            required
            className="input"
          />
        </label>
        <input
          type="number"
          name="seatsAvailable"
          placeholder="Seats Available"
          value={flightForm.seatsAvailable}
          onChange={handleFlightInputChange}
          required
          min="1"
          className="input"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={flightForm.price}
          onChange={handleFlightInputChange}
          required
          min="0"
          className="input"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingFlightId ? "Update Flight" : "Add Flight"}
        </button>
        {editingFlightId && (
          <button
            type="button"
            onClick={() => {
              setEditingFlightId(null);
              setFlightForm({
                flightNumber: "",
                departure: "",
                arrival: "",
                departureTime: "",
                arrivalTime: "",
                price: 0,
                seatsAvailable: 0,
              });
            }}
            className="ml-4 px-4 py-2 border rounded"
          >
            Cancel
          </button>
        )}
      </form>
      {/* Flights table - update table headers and rows */}
      {flightsLoading ? (
        <p>Loading flights...</p>
      ) : flightsError ? (
        <p className="text-red-600">{flightsError}</p>
      ) : flights.length === 0 ? (
        <p>No flights found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3">Flight #</th>
              <th className="border border-gray-300 p-3">Departure</th>
              <th className="border border-gray-300 p-3">Arrival</th>
              <th className="border border-gray-300 p-3">Dep Time</th>
              <th className="border border-gray-300 p-3">Arr Time</th>
              <th className="border border-gray-300 p-3">Seats</th>
              <th className="border border-gray-300 p-3">Price</th>
              <th className="border border-gray-300 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">
                  {flight.flightNumber}
                </td>
                <td className="border border-gray-300 p-3">
                  {flight.departure}
                </td>
                <td className="border border-gray-300 p-3">{flight.arrival}</td>
                <td className="border border-gray-300 p-3">
                  {new Date(flight.departureTime).toLocaleString()}
                </td>
                <td className="border border-gray-300 p-3">
                  {new Date(flight.arrivalTime).toLocaleString()}
                </td>
                <td className="border border-gray-300 p-3">
                  {flight.seatsAvailable}
                </td>
                <td className="border border-gray-300 p-3">${flight.price}</td>
                <td className="border border-gray-300 p-3 text-center space-x-2">
                  <button
                    onClick={() => handleEditFlight(flight)}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFlight(flight._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* --- Bookings Section --- */}
      <h2 className="text-2xl font-semibold mb-4 mt-10">All Bookings</h2>
      {bookingsLoading ? (
        <p>Loading bookings...</p>
      ) : bookingsError ? (
        <p className="text-red-600">{bookingsError}</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3">User</th>
              <th className="border border-gray-300 p-3">Flight</th>
              <th className="border border-gray-300 p-3">Seats Booked</th>
              <th className="border border-gray-300 p-3">Booking Date</th>
              <th className="border border-gray-300 p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              return (
                <tr key={booking._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3">
                    {booking.user?.email || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {booking.flight?.flightNumber || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {booking.seatsBooked || "N/A"}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {booking.bookingDate
                      ? new Date(booking.bookingDate).toLocaleString()
                      : "N/A"}
                  </td>

                  <td className="border border-gray-300 p-3 text-center">
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure?")) {
                          handleDeleteBooking(booking._id);
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default AdminPanel;
