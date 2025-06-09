import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import londonImg from "../assets/london1.jpg";
import tokyoImg from "../assets/tokyo.jpg";
import parisImg from "../assets/paris.jpg";
import dubaiImg from "../assets/dubai.jpg";
import berlinImg from "../assets/berlin.jpg";
import newyorkImg from "../assets/newyork.jpg";
import lvivImg from "../assets/lviv.jpg";
import odesaImg from "../assets/odesa.jpg";
import warsawImg from "../assets/warsaw.jpg";
import kyivImg from "../assets/kyiv.jpg";

const cityImages = {
  London: londonImg,
  Tokyo: tokyoImg,
  Paris: parisImg,
  Dubai: dubaiImg,
  Berlin: berlinImg,
  "New York": newyorkImg,
  Lviv: lvivImg,
  Odesa: odesaImg,
  Warsaw: warsawImg,
  Kyiv: kyivImg,
};

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="checkbox"
        checked={selected}
        onChange={(e) => onChange(e.target.checked, label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className="flex gap-3 items-center cursor-pointer mt-2 text-sm">
      <input
        type="radio"
        name="sortOption"
        checked={selected}
        onChange={() => onChange(label)}
      />
      <span className="font-light select-none">{label}</span>
    </label>
  );
};

const Flights = () => {
  const location = useLocation();
  const [openFilters, setOpenFilters] = useState(false);

  const popularFlights = ["To London", "To Tokyo", "To New York"];
  const priceRanges = [
    "0 to 500",
    "500 to 1000",
    "1000 to 2000",
    "2000 to 3000",
  ];
  const sortOptions = [
    "Price Low to High",
    "Price High to Low",
    "Newest First",
  ];

  const query = new URLSearchParams(location.search);
  const fromParam = query.get("from") || "";
  const toParam = query.get("to") || "";
  const dateParam = query.get("date") || "";
  const passengersParam = parseInt(query.get("passengers"), 10) || 1;

  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchFrom, setSearchFrom] = useState(fromParam);
  const [searchTo, setSearchTo] = useState(toParam);
  const [bookingFlightId, setBookingFlightId] = useState(null);
  const [seats, setSeats] = useState(passengersParam);

  const [selectedPopularFilters, setSelectedPopularFilters] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("");

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/flights");
        if (!response.ok) throw new Error("Failed to fetch flights");
        const data = await response.json();
        setFlights(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching flights:", err.message);
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleBook = async (flightId) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login to book a flight");

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ flightId, seatsBooked: seats }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Booking failed");
      }

      alert("Booking successful!");
      setBookingFlightId(null);
      setSeats(1);
    } catch (err) {
      alert("Booking failed: " + err.message);
    }
  };

  const handlePopularChange = (isChecked, label) => {
    setSelectedPopularFilters((prev) =>
      isChecked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handlePriceRangeChange = (isChecked, label) => {
    setSelectedPriceRanges((prev) =>
      isChecked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const handleSortChange = (label) => {
    setSelectedSortOption(label);
  };

  const formatDateTime = (str) => new Date(str).toLocaleString();

  const filteredFlights = flights
    .filter((flight) => {
      const fromMatch = flight.departure
        ?.toLowerCase()
        .includes(searchFrom.toLowerCase());
      const toMatch = flight.arrival
        ?.toLowerCase()
        .includes(searchTo.toLowerCase());

      const popularMatch =
        selectedPopularFilters.length === 0 ||
        selectedPopularFilters.some((filter) =>
          flight.arrival
            .toLowerCase()
            .includes(filter.toLowerCase().replace("to ", ""))
        );

      const priceMatch =
        selectedPriceRanges.length === 0 ||
        selectedPriceRanges.some((range) => {
          const match = range.match(/(\d+)\s*to\s*(\d+)/);
          if (!match) return true;
          const min = parseInt(match[1], 10);
          const max = parseInt(match[2], 10);
          return flight.price >= min && flight.price <= max;
        });

      const seatsMatch = flight.seatsAvailable >= passengersParam;

      return fromMatch && toMatch && popularMatch && priceMatch && seatsMatch;
    })
    .sort((a, b) => {
      if (selectedSortOption === "Price Low to High") return a.price - b.price;
      if (selectedSortOption === "Price High to Low") return b.price - a.price;
      if (selectedSortOption === "Newest First") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  return (
    <main className="max-w-6xl px-6 py-16 pt-28 mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        Available Flights
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mb-10 flex flex-col md:flex-row gap-4 max-w-full"
          >
            <input
              type="text"
              placeholder="From..."
              value={searchFrom}
              onChange={(e) => setSearchFrom(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              placeholder="To..."
              value={searchTo}
              onChange={(e) => setSearchTo(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-md"
            />
          </form>

          {loading ? (
            <p className="text-center text-gray-500">Loading flights...</p>
          ) : filteredFlights.length === 0 ? (
            <p className="text-center text-gray-500">No flights found.</p>
          ) : (
            <ul className="space-y-6">
              {filteredFlights.map((flight) => (
                <li
                  key={flight._id}
                  className="border p-6 rounded-md shadow-sm hover:shadow transition flex gap-6 items-center"
                >
                  {cityImages[flight.arrival] ? (
                    <img
                      src={cityImages[flight.arrival]}
                      alt={flight.arrival}
                      className="w-40 h-24 object-cover rounded-md flex-shrink-0"
                    />
                  ) : (
                    <div className="w-40 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center text-gray-400 text-sm">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-blue-700">
                        {flight.departure} → {flight.arrival}
                      </h2>
                      <p className="text-gray-600">{flight.flightNumber}</p>
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
                        <strong>Available Seats:</strong>{" "}
                        {flight.seatsAvailable}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      ${flight.price}
                    </div>
                  </div>

                  {bookingFlightId === flight._id ? (
                    <div className="mt-4 flex gap-4 items-center">
                      <input
                        type="number"
                        min="1"
                        max={flight.seatsAvailable}
                        value={seats}
                        onChange={(e) => setSeats(parseInt(e.target.value))}
                        className="w-24 px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => handleBook(flight._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setBookingFlightId(null)}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setBookingFlightId(flight._id)}
                      className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Book
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16 sticky top-28 self-start h-fit">
          <div
            className={`flex items-center justify-between px-5 py-2.5 min-lg:border-b border-gray-300 ${
              openFilters && "border-b"
            }`}
          >
            <p className="text-base font-medium text-gray-800">FILTERS</p>
            <div className="text-xs cursor-pointer">
              <span
                onClick={() => setOpenFilters(!openFilters)}
                className="lg:hidden"
              >
                {openFilters ? "HIDE" : "SHOW"}
              </span>
              <span
                className="hidden lg:block cursor-pointer"
                onClick={() => {
                  setSelectedPopularFilters([]);
                  setSelectedPriceRanges([]);
                  setSelectedSortOption("");
                }}
              >
                CLEAR
              </span>
            </div>
          </div>

          <div
            className={`${
              openFilters ? "h-auto" : "h-0 lg:h-auto"
            } overflow-hidden transition-all duration-700`}
          >
            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Popular filters</p>
              {popularFlights.map((popular, index) => (
                <CheckBox
                  key={index}
                  label={popular}
                  selected={selectedPopularFilters.includes(popular)}
                  onChange={handlePopularChange}
                />
              ))}
            </div>
            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Price Range</p>
              {priceRanges.map((range, index) => (
                <CheckBox
                  key={index}
                  label={`$ ${range}`}
                  selected={selectedPriceRanges.includes(`$ ${range}`)}
                  onChange={handlePriceRangeChange}
                />
              ))}
            </div>
            <div className="px-5 pt-5">
              <p className="font-medium text-gray-800 pb-2">Sort By</p>
              {sortOptions.map((option, index) => (
                <RadioButton
                  key={index}
                  label={option}
                  selected={selectedSortOption === option}
                  onChange={handleSortChange}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Flights;
