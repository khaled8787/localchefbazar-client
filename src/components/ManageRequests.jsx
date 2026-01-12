import React from "react";
import useAxiosPublic from "../AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

const ManageRequests = () => {
  const axiosSecure = useAxiosPublic();

  const { data: requests = [], refetch, isLoading } = useQuery({
    queryKey: ["roleRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests");
      return res.data;
    },
  });

  const handleAction = async (id, action) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `You want to ${action} this role request`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: action === "approve" ? "#F97316" : "#DC2626",
      cancelButtonColor: "#64748B",
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.patch(`/role-requests/${id}`, { action });
      Swal.fire("Success", res.data.message, "success");
      refetch();
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Server error",
        "error"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-xl text-orange-500"></span>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 md:p-10">
      
      {/* Animated background circles */}
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg">
            <FaUserShield size={22} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Manage Role Requests
            </h2>
            <p className="text-sm text-gray-300">
              Approve or reject user role upgrade requests
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No role requests found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-2xl overflow-hidden shadow-lg text-white">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Request Type</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Time</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req._id}
                      className="border-b border-gray-700 hover:bg-gray-700 transition"
                    >
                      <td className="py-4 px-6 font-medium">{req.userName}</td>
                      <td className="py-4 px-6">{req.userEmail}</td>
                      <td className="py-4 px-6 capitalize font-semibold">
                        {req.requestType}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            req.requestStatus === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : req.requestStatus === "approved"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {req.requestStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-400">
                        {new Date(req.requestTime).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center flex justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={req.requestStatus !== "pending"}
                          onClick={() => handleAction(req._id, "approve")}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
                        >
                          <FaCheckCircle /> Accept
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={req.requestStatus !== "pending"}
                          onClick={() => handleAction(req._id, "reject")}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex items-center gap-1 disabled:opacity-50"
                        >
                          <FaTimesCircle /> Reject
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden grid gap-4">
              {requests.map((req) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-900/70 rounded-3xl shadow-xl p-5 border border-gray-700 transform hover:scale-105 transition text-white"
                >
                  <h3 className="font-bold text-lg">{req.userName}</h3>
                  <p className="text-sm text-gray-300">{req.userEmail}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-outline capitalize bg-gray-800 text-white">
                      {req.requestType}
                    </span>
                    <span
                      className={`badge ${
                        req.requestStatus === "pending"
                          ? "badge-warning"
                          : req.requestStatus === "approved"
                          ? "badge-success"
                          : "badge-error"
                      }`}
                    >
                      {req.requestStatus}
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(req.requestTime).toLocaleString()}
                  </p>

                  <div className="mt-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={req.requestStatus !== "pending"}
                      onClick={() => handleAction(req._id, "approve")}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg flex-1 disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <FaCheckCircle /> Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={req.requestStatus !== "pending"}
                      onClick={() => handleAction(req._id, "reject")}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg flex-1 disabled:opacity-50 flex items-center justify-center gap-1"
                    >
                      <FaTimesCircle /> Reject
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
};

export default ManageRequests;
