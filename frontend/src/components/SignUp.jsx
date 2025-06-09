import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Перевірка чи паролі збігаються
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("https://flight-booking-1-2gzk.onrender.com/api/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user", // або "admin"
      });

      navigate("/login");
    } catch (err) {
      console.error("Sign up error", err.response?.data);
      setError(err.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 py-6 bg-white shadow-lg"
      >
        <h1 className="text-gray-900 text-3xl mt-4 font-medium">Sign Up</h1>
        <p className="text-gray-500 text-sm mt-2">Create a new account</p>

        {/* Name */}
        <div className="flex items-center w-full mt-8 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            required
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 font-medium">{error}</div>
        )}

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Sign Up
        </button>

        <p className="text-gray-500 text-sm mt-3 mb-4">
          Already have an account?{" "}
          <a className="text-indigo-500" href="/login">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
