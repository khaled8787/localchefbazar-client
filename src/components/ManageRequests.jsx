import React from "react";
import useAxiosPublic from "../AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaUserShield } from "react-icons/fa";

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
      confirmButtonColor: action === "approve" ? "#22c55e" : "#ef4444",
      cancelButtonColor: "#64748b",
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
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-100 p-6 md:p-10 relative overflow-hidden">

        {/* Glow Effect */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg">
            <FaUserShield size={22} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Manage Role Requests
            </h2>
            <p className="text-sm text-gray-500">
              Approve or reject user role upgrade requests
            </p>
          </div>
        </div>

        {/* Empty State */}
        {requests.length === 0 ? (
          <div className="relative z-10 text-center py-20 text-gray-500">
            No role requests found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block relative z-10 overflow-x-auto">
              <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow-lg">
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
                      className="border-b hover:bg-orange-50 transition"
                    >
                      <td className="py-4 px-6 font-medium">
                        {req.userName}
                      </td>
                      <td className="py-4 px-6">{req.userEmail}</td>
                      <td className="py-4 px-6 capitalize font-semibold">
                        {req.requestType}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            req.requestStatus === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : req.requestStatus === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {req.requestStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(req.requestTime).toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center flex justify-center gap-2">
                        <button
                          disabled={req.requestStatus !== "pending"}
                          onClick={() => handleAction(req._id, "approve")}
                          className="btn btn-success btn-sm flex gap-1"
                        >
                          <FaCheckCircle /> Accept
                        </button>
                        <button
                          disabled={req.requestStatus !== "pending"}
                          onClick={() => handleAction(req._id, "reject")}
                          className="btn btn-error btn-sm flex gap-1"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden relative z-10 grid gap-4">
              {requests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl shadow-lg p-5 border border-orange-100"
                >
                  <h3 className="font-bold text-lg text-gray-800">
                    {req.userName}
                  </h3>
                  <p className="text-sm text-gray-500">{req.userEmail}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="badge badge-outline capitalize">
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
                    <button
                      disabled={req.requestStatus !== "pending"}
                      onClick={() => handleAction(req._id, "approve")}
                      className="btn btn-success btn-sm flex-1"
                    >
                      Accept
                    </button>
                    <button
                      disabled={req.requestStatus !== "pending"}
                      onClick={() => handleAction(req._id, "reject")}
                      className="btn btn-error btn-sm flex-1"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManageRequests;
