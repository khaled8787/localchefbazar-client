import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? "#2563eb" : "#1f2937",
    fontWeight: isActive ? "600" : "500",
  });

  const links = (
    <>
      <li>
        <NavLink to="/" style={getLinkStyle}>Home</NavLink>
      </li>
      <li>
        <NavLink to="/meals" style={getLinkStyle}>Meals</NavLink>
      </li>
      <li>
        <NavLink to="/about" style={getLinkStyle}>About</NavLink>
      </li>
      <li>
        <NavLink to="/contact" style={getLinkStyle}>Contact</NavLink>
      </li>
      {user && (
        <li>
          <NavLink to="/admin-sidebar" style={getLinkStyle}>
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50">
      <div className="w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 shadow-lg">
        <div className="container mx-auto px-4 lg:px-10 flex justify-between items-center h-20">

          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
          >
            <NavLink to="/" className="text-3xl font-bold text-white">
              LocalChefBazaar
            </NavLink>
          </motion.div>

          {/* Desktop Links */}
          <nav className="hidden lg:flex">
            <ul className="flex gap-8 items-center text-white">
              {links}
            </ul>
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4 relative">
            {!user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-lg"
                  onClick={() => navigate("/login")}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white shadow-lg"
                  onClick={() => navigate("/register")}
                >
                  Register
                </motion.button>
              </>
            ) : (
              <div
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
                className="relative"
              >
                {/* Profile Image */}
                <motion.div whileHover={{ scale: 1.15 }}>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-lg cursor-pointer"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer">
                      {user.email[0].toUpperCase()}
                    </div>
                  )}
                </motion.div>

                {/* Dropdown */}
                <AnimatePresence>
                  {open && (
                    <motion.ul
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.25 }}
                      className="absolute right-0 top-14 w-44 rounded-xl overflow-hidden shadow-xl
                      bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white"
                    >
                      
                      <li
                        onClick={logOut}
                        className="px-4 py-3 hover:bg-red-500/80 cursor-pointer transition font-semibold"
                      >
                        Logout
                      </li>
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden dropdown">
            <label tabIndex={0} className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul className="dropdown-content menu p-4 shadow bg-white rounded-box w-52 mt-2">
              {links}
              {!user ? (
                <>
                  <li><button onClick={() => navigate("/login")}>Login</button></li>
                  <li><button onClick={() => navigate("/register")}>Register</button></li>
                </>
              ) : (
                <li><button className="text-black font-bold btn btn-error" onClick={logOut}>Logout</button></li>
              )}
            </ul>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
