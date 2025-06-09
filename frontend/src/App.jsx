import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Flights from "./pages/Flights";
import MyBookings from "./pages/MyBookings";
import ProfileSettings from "./pages/ProfileSettings";
import AdminPanel from "./pages/AdminPanel";
import Footer from "./components/Footer";

const App = () => {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </AuthProvider>
  );
};

export default App;
