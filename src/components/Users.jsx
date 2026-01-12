import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiTrash2, FiUserCheck, FiAlertTriangle } from "react-icons/fi";
import useAxiosPublic from "../AxiosSecure";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const Users = () => {
  const axiosInstance = useAxiosPublic();

  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users");
      return data;
    },
  });

  const handleMakeAdmin = async (id) => {
    try {
      const res = await axiosInstance.patch(`/users/admin/${id}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User has been made an Admin.",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "User is already an Admin.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again.",
      });
      console.error(error);
    }
  };

  const handleMakeChef = async (id) => {
    try {
      const res = await axiosInstance.put(`/users/chef/${id}`);
      if (res.data.modifiedCount > 0) {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "User has been made a Chef.",
          timer: 2000,
          showConfirmButton: false,
        });
        refetch();
      } else {
        Swal.fire({
          icon: "info",
          title: "Info",
          text: "User is already a Chef.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again.",
      });
      console.error(error);
    }
  };

  const handleMakeFraud = async (id) => {
    Swal.fire({
      title: "Mark as Fraud?",
      text: "This user will be restricted from actions!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Make Fraud",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosInstance.patch(`/users/fraud/${id}`);
        Swal.fire("Success!", "User marked as fraud.", "success");
        refetch();
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosInstance.delete(`/users/${id}`);
        Swal.fire("Deleted!", "User has been removed.", "success");
        refetch();
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-bars loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 md:p-10">
      {/* Background Circles */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Glass Card */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto p-6 md:p-10 backdrop-blur-xl bg-gray-900/70 rounded-3xl shadow-2xl border border-gray-700"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-orange-400">
          Manage Users
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-gray-700 shadow-xl">
          <table className="table w-full text-white">
            <thead className="bg-gray-800 text-lg">
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user, idx) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-700 transition-all"
                >
                  <td>{idx + 1}</td>

                  <td className="flex items-center gap-3">
                    <img
                      src={user.photo || "https://i.ibb.co/4pDNDk1/avatar.png"}
                      className="w-12 h-12 rounded-full border border-gray-500"
                    />
                    <p className="font-semibold">{user.name}</p>
                  </td>

                  <td>{user.email}</td>

                  <td className="capitalize font-semibold">{user.role}</td>

                  <td>
                    {user.status === "fraud" ? (
                      <span className="badge bg-red-600 text-white">
                        Fraud
                      </span>
                    ) : (
                      <span className="badge bg-green-600 text-white">
                        Active
                      </span>
                    )}
                  </td>

                  <td className="flex flex-wrap justify-center gap-2 mt-2 md:mt-0">
                    {user.role !== "admin" && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMakeAdmin(user._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          <FiUserCheck /> Admin
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleMakeChef(user._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm disabled:opacity-50"
                        >
                          <FiUserCheck /> Chef
                        </motion.button>
                      </>
                    )}

                    {user.role !== "admin" && user.status !== "fraud" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleMakeFraud(user._id)}
                        className="flex items-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm disabled:opacity-50"
                      >
                        <FiAlertTriangle /> Fraud
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(user._id)}
                      className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                    >
                      <FiTrash2 /> Delete
                    </motion.button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
};

export default Users;
