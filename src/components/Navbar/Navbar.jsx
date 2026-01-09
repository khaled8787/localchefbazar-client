import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { motion } from "framer-motion";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? "#2563eb" : "#1f2937",
    fontWeight: isActive ? "600" : "500",
  });

  const links = (
    <>
      <li>
        <NavLink to="/" style={getLinkStyle}>
          Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/meals" style={getLinkStyle}>
          Meals
        </NavLink>
      </li>
      <li>
        <NavLink to="/about" style={getLinkStyle}>
          About
        </NavLink>
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
      {/* 3D gradient background */}
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
            <ul className="flex gap-8 items-center">
              {links}
            </ul>
          </nav>

          {/* Right Buttons / Profile */}
          <div className="hidden lg:flex items-center gap-4">
            {!user ? (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white shadow-lg hover:shadow-2xl transition"
                  onClick={() => navigate("/login")}
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white shadow-lg hover:shadow-2xl transition"
                  onClick={() => navigate("/register")}
                >
                  Register
                </motion.button>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  className="relative"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Profile"
                      className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold shadow-lg">
                      {user.email[0].toUpperCase()}
                    </div>
                  )}
                  {/* Dropdown on hover */}
                  <ul className="absolute top-14 right-0 hidden group-hover:flex flex-col bg-white rounded shadow-lg w-40 py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={logOut}>
                      Logout
                    </li>
                  </ul>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden dropdown">
            <label tabIndex={0} className="btn btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-4 shadow bg-white rounded-box w-52 mt-2 flex flex-col gap-2"
            >
              {links}
              {!user ? (
                <>
                  <li>
                    <button onClick={() => navigate("/login")} className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
                      Login
                    </button>
                  </li>
                  <li>
                    <button onClick={() => navigate("/register")} className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
                      Register
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button onClick={logOut} className="w-full text-left px-2 py-1 rounded hover:bg-gray-100">
                    Logout
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
