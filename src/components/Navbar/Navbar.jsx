import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? "#2563eb" : "#1f2937", // Active blue / inactive gray
    borderBottom: isActive ? "2px solid #2563eb" : "none",
    paddingBottom: "2px",
    fontWeight: "500",
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
      {user && (
        <li>
          <NavLink to="/dashboard" style={getLinkStyle}>
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-10 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <NavLink to="/" className="text-2xl font-bold text-blue-600">
            LocalChefBazaar
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex">
          <ul className="flex gap-8 items-center">{links}</ul>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-blue-500"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {user.email[0].toUpperCase()}
                </div>
              )}
              <button
                onClick={logOut}
                className="px-4 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Dropdown */}
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
                  <button
                    onClick={() => navigate("/register")}
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-100"
                  >
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
    </header>
  );
};

export default Navbar;
