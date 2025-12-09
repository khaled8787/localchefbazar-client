import React from "react";
import { NavLink, Outlet } from "react-router";
import {
  FaUsers,
  FaHotdog,
  FaClipboardList,
  FaUserTie,
  FaStar,
  FaBars,
} from "react-icons/fa";

const AdminSidebarLayout = () => {
  const baseClass =
    "flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-200";
  const activeClass = "bg-orange-600 text-white shadow-lg scale-[1.02]";
  const normalClass = "text-gray-700 hover:bg-orange-100 hover:text-orange-700";

  return (
    <div className="drawer lg:drawer-open">
      {/* Drawer Toggle */}
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Mobile navbar */}
        <div className="lg:hidden p-4 shadow-md flex items-center justify-between bg-white/70 backdrop-blur-xl">
          <label htmlFor="admin-drawer" className="btn btn-ghost text-2xl">
            <FaBars />
          </label>
          <h2 className="text-xl font-bold text-orange-600">Admin Panel</h2>
        </div>

        {/* Page content from nested routes */}
        <div className="p-5">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="admin-drawer" className="drawer-overlay"></label>

        <div
          className="
            w-64 min-h-full
            bg-white/60 backdrop-blur-xl
            border-r shadow-xl
            p-5 flex flex-col
            relative
          "
        >
          <div className="absolute inset-y-0 right-0 w-[3px] bg-gradient-to-b from-orange-400 to-yellow-500"></div>

          <h2 className="text-3xl font-bold text-orange-600 mb-8 drop-shadow-md">
            Admin Panel
          </h2>

          <nav className="flex flex-col gap-3 text-lg">
            <NavLink
              to="users"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FaUsers /> Users
            </NavLink>

            <NavLink
              to="/admin/chefs"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FaUserTie /> Chefs
            </NavLink>

            <NavLink
              to="/admin/meals"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FaHotdog /> Meals
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FaClipboardList /> Orders
            </NavLink>

            <NavLink
              to="/admin/reviews"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FaStar /> Reviews
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebarLayout;
