import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaUser,
  FaUsers,
  FaHotdog,
  FaClipboardList,
  FaStar,
  FaHeart,
  FaUserTie,
  FaPlus,
  FaBars,
  FaChartPie,
} from "react-icons/fa";
import { AuthContext } from "../AuthContext";

const SidebarLayout = () => {
  const { user, loading } = useContext(AuthContext);
  console.log("Logged User:", user);
  console.log("User Role:", user?.role);

  const baseClass =
    "flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-200";
  const activeClass = "bg-orange-600 text-white shadow-lg scale-[1.02]";
  const normalClass = "text-gray-700 hover:bg-orange-100 hover:text-orange-700";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-xl"></span>
      </div>
    );
  }

  if (!user) return null; // user load না হলে কিছু দেখাবো না

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer Toggle */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile navbar */}
        <div className="lg:hidden p-4 shadow-md flex items-center justify-between bg-white/70 backdrop-blur-xl">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost text-2xl">
            <FaBars />
          </label>
          <h2 className="text-xl font-bold text-orange-600">Dashboard</h2>
        </div>

        {/* Page content */}
        <div className="p-5">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <div className="w-64 min-h-full bg-white/60 backdrop-blur-xl border-r shadow-xl p-5 flex flex-col relative">
          <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-orange-400 to-yellow-500"></div>

          <h2 className="text-3xl font-bold text-orange-600 mb-8 drop-shadow-md">
            Dashboard
          </h2>

          <nav className="flex flex-col gap-3 text-lg">
            {/* My Profile – সবর জন্য common */}
            <NavLink
              to="profile"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FaUser /> My Profile
            </NavLink>

            {/* ==================== User Dashboard ==================== */}
            {user.role === "user" && (
              <>
                <NavLink
                  to="my-orders"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaClipboardList /> My Orders
                </NavLink>

                <NavLink
                  to="my-reviews"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaStar /> My Reviews
                </NavLink>

                <NavLink
                  to="favorites"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaHeart /> Favorite Meals
                </NavLink>
              </>
            )}

            {/* ==================== Chef Dashboard ==================== */}
            {user.role === "chef" && (
              <>
                <NavLink
                  to="create-meal"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaPlus /> Create Meal
                </NavLink>

                <NavLink
                  to="my-meals"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaHotdog /> My Meals
                </NavLink>

                <NavLink
                  to="orders"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaClipboardList /> Order Requests
                </NavLink>
              </>
            )}

            {/* ==================== Admin Dashboard ==================== */}
            {user.role === "admin" && (
              <>
                <NavLink
                  to="users"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaUsers /> Manage Users
                </NavLink>

                <NavLink
                  to="requests"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaClipboardList /> Manage Requests
                </NavLink>

                <NavLink
                  to="platform"
                  className={({ isActive }) =>
                    `${baseClass} ${isActive ? activeClass : normalClass}`
                  }
                >
                  <FaChartPie /> Platform Statistics
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
