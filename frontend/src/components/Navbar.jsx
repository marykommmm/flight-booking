import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import userIcon from "../assets/userIcon.svg";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Flights", path: "/flights" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
  ];
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);

  const navigate = useNavigate();

  const { user, logout } = useContext(AuthContext);
  console.log("User in Navbar:", user);

  const navBackgroundClass = isHomePage
    ? isScrolled
      ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
      : "py-4 md:py-6 bg-transparent text-white"
    : "bg-white shadow-md py-4 md:py-6 text-gray-800 border-b border-gray-200";

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${navBackgroundClass}`}
    >
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-12 w-auto ${
            !isHomePage
              ? "filter brightness-0"
              : isScrolled
              ? "invert opacity-80"
              : ""
          }`}
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isHomePage
                ? isScrolled
                  ? "text-gray-700"
                  : "text-white"
                : "text-gray-800"
            }`}
          >
            {link.name}
            <div
              className={`${
                isHomePage
                  ? isScrolled
                    ? "bg-gray-700"
                    : "bg-white"
                  : "bg-gray-800"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}
      </div>

      {/* Desktop Right */}
      <div className="hidden md:flex items-center gap-4 relative">
        {user ? (
          <div
            className="relative"
            onMouseEnter={() => setIsProfileMenuOpen(true)}
            onMouseLeave={() => setIsProfileMenuOpen(false)}
          >
            <button
              className="flex items-center gap-2"
              title={user.name || "Profile"}
            >
              <img
                src={user.avatar || userIcon}
                alt="Profile"
                className={`h-8 w-8 rounded-full object-cover border border-gray-700 ${
                  !isHomePage ? "filter brightness-0" : ""
                }`}
              />

              <span
                className={`hidden ${
                  !isHomePage
                    ? "text-gray-800"
                    : isScrolled
                    ? "text-gray-700"
                    : "text-white"
                } md:inline`}
              >
                {user.name || "User"}
              </span>
            </button>

            {/* Dropdown */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                <Link
                  to="/bookings"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  My Bookings
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Profile Settings
                </Link>

                {/* Додай це посилання, якщо користувач — адміністратор */}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setIsProfileMenuOpen(false);
                    navigate("/");
                  }}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500 hover:opacity-90"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center gap-3 md:hidden">
        <svg
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <svg
            className={`h-6 w-6 ${
              !isHomePage ? "text-gray-800" : isScrolled ? "invert" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="w-full text-center"
          >
            {link.name}
          </Link>
        ))}

        {user ? (
          <>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
                navigate("/");
              }}
              className="bg-red-500 text-white px-8 py-2.5 rounded-full w-full"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" onClick={() => setIsMenuOpen(false)}>
            <button className="bg-black text-white px-8 py-2.5 rounded-full w-full">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
