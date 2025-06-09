import React from "react";
import { useNavigate } from "react-router-dom"; // імпортуємо useNavigate

const Hero = () => {
  const navigate = useNavigate(); // ініціалізуємо navigate

  // Стейти всередині компонента
  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [date, setDate] = React.useState("");
  const [passengers, setPassengers] = React.useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!from || !to || !date || !passengers) {
      alert("Please fill all fields");
      return;
    }

    navigate(
      `/flights?from=${encodeURIComponent(from)}&to=${encodeURIComponent(
        to
      )}&date=${encodeURIComponent(date)}&passengers=${encodeURIComponent(
        passengers
      )}`
    );
  };

  return (
    <div className="relative flex flex-col px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/hero.png')] bg-no-repeat bg-cover bg-center h-screen">
      {/* Літак зверху */}
      <img
        src="/plane.png"
        alt="Airplane"
        className="absolute right-[80px] top-32 w-[600px] md:w-[700px] lg:w-[800px] animate-float"
      />

      {/* Обгортка для тексту і форми */}
      <div className="flex flex-col items-start justify-end flex-1 w-full max-w-3xl ml-4 mb-25">
        {/* Текст */}
        <h1 className="text-4xl md:text-6xl font-bold z-10">
          Welcome to Flight App
        </h1>
        <p className="mt-4 text-lg md:text-xl text-white/80 z-10">
          Book your next adventure with ease!
        </p>

        {/* Форма */}
        <form
          onSubmit={handleSubmit}
          className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-10 flex flex-col md:flex-row max-md:items-start gap-4 z-10 w-full"
        >
          {/* From */}
          <div className="w-full max-w-[160px]">
            <label htmlFor="departure" className="flex items-center gap-2">
              <span>From</span>
            </label>
            <input
              list="airports"
              id="departure"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              type="text"
              className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
              placeholder="From"
              required
            />
          </div>

          {/* To */}
          <div className="w-full max-w-[160px]">
            <label htmlFor="destination" className="flex items-center gap-2">
              <span>To</span>
            </label>
            <input
              list="airports"
              id="destination"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              type="text"
              className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
              placeholder="To"
              required
            />
          </div>

          {/* Date */}
          <div className="w-full max-w-[180px]">
            <label htmlFor="checkIn" className="flex items-center gap-2">
              <span>Date</span>
            </label>
            <input
              id="checkIn"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
              required
            />
          </div>

          {/* Passengers */}
          <div className="w-full max-w-[120px]">
            <label htmlFor="passengers" className="flex items-center gap-2">
              <span>Passengers</span>
            </label>
            <input
              id="passengers"
              type="number"
              min={1}
              max={10}
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
              placeholder="1"
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white self-end md:self-auto max-md:w-full max-md:py-2"
          >
            <svg
              className="w-4 h-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
              />
            </svg>
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Datalist */}
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
    </div>
  );
};

export default Hero;
