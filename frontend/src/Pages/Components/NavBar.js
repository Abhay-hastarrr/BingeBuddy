import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Home, Search, Info, User } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./images/Logo2.png";

const NavBar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) user = JSON.parse(storedUser);
  } catch (err) {
    console.error("Error parsing user from localStorage", err);
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const closeDropdown = () => setDropdownOpen(false);

  return (
    <div className="w-full bg-black shadow-md px-6 py-3 flex items-center justify-between relative z-50 h-20">
      {/* Left - Logo */}
      <Link to="/" className="flex items-center h-full pl-6">
        <motion.img
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          src={Logo}
          alt="MovieFlix Logo"
          className="w-32 h-auto"
        />
      </Link>

      {/* Center - Icons */}
      <div className="flex-1 flex justify-center space-x-6">
        <Link
          to="/"
          className="text-red-500 p-2 rounded-full hover:bg-red-100 hover:text-black transition"
        >
          <Home size={22} />
        </Link>
        <Link
          to="/movies"
          className="text-red-500 p-2 rounded-full hover:bg-red-100 hover:text-black transition"
        >
          <Search size={22} />
        </Link>
        <Link
          to="/about"
          className="text-red-500 p-2 rounded-full hover:bg-red-100 hover:text-black transition"
          title="About Us"
        >
          <Info size={22} />
        </Link>
      </div>

      {/* Right - Auth / Dropdown */}
      <div className="flex items-center space-x-4 text-white relative">
        {user ? (
          <div className="relative" onMouseLeave={closeDropdown}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-red-500 font-semibold px-4 py-2 rounded hover:bg-red-100 hover:text-black transition"
            >
              <User size={18} />
              
              <ChevronDown size={18} />
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 w-40 bg-white text-black rounded shadow-md mt-1 z-50"
                >
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    Logout
                  </button>
                  
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <>
            <Link
              to="/login"
              className="text-red-500 font-semibold px-4 py-2 rounded hover:bg-red-100 hover:text-black transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-red-500 font-semibold px-4 py-2 rounded hover:bg-red-100 hover:text-black transition"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
