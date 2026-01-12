import React, { useContext } from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaUser,
  FaUsers,
  FaHotdog,
  FaClipboardList,
  FaStar,
  FaHeart,
  FaPlus,
  FaBars,
  FaChartPie,
} from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import { motion } from "framer-motion";

const SidebarLayout = () => {
  const { user, loading } = useContext(AuthContext);

  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300";
  const activeClass =
    "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg scale-[1.03]";
  const normalClass =
    "text-gray-700 hover:bg-orange-100 hover:text-orange-700";

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* ================= CONTENT ================= */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-40 p-4 flex items-center justify-between bg-white/80 backdrop-blur-xl shadow">
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost text-2xl text-orange-600"
          >
            <FaBars />
          </label>
          <h2 className="text-xl font-bold text-orange-600">
            Dashboard
          </h2>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <motion.aside
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-72 min-h-full bg-white/70 backdrop-blur-2xl border-r shadow-2xl p-6 flex flex-col relative"
        >
          {/* Gradient Border */}
          <div className="absolute inset-y-0 right-0 w-[4px] bg-gradient-to-b from-orange-400 to-red-500"></div>

          {/* Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-orange-600 drop-shadow">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome, {user?.email}
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3 text-[16px]">
            <NavLink
              to="/admin-sidebar"
              end
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FaUser /> My Profile
            </NavLink>

            {/* USER */}
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

            {/* CHEF */}
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

            {/* ADMIN */}
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
        </motion.aside>
      </div>
    </div>
  );
};

export default SidebarLayout;
