import React from "react";
import useAxiosPublic from "../AxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";

const ManageRequests = () => {
  const axiosSecure = useAxiosPublic();

  const { data: requests = [], refetch } = useQuery({
    queryKey: ["roleRequests"],
    queryFn: async () => {
      const res = await axiosSecure.get("/role-requests");
      return res.data;
    },
  });

  const handleAction = async (id, action) => {
    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${action} this request`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      console.log("Sending PATCH request...", id, action);
      const res = await axiosSecure.patch(`/role-requests/${id}`, { action });
      console.log("PATCH response:", res.data);

      Swal.fire("Success", res.data.message, "success");
      refetch();
    } catch (err) {
      console.error("Action error:", err);
      Swal.fire("Error", err.response?.data?.message || "Server error", "error");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        Manage Role Requests
      </h2>

      <div className="overflow-x-auto rounded-2xl shadow-lg">
        <table className="table table-zebra w-full">
          <thead className="bg-orange-500 text-white">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req._id}>
                <td>{req.userName}</td>
                <td>{req.userEmail}</td>
                <td className="capitalize font-semibold">{req.requestType}</td>
                <td>
                  <span
                    className={`badge badge-${
                      req.requestStatus === "pending"
                        ? "warning"
                        : req.requestStatus === "approved"
                        ? "success"
                        : "error"
                    }`}
                  >
                    {req.requestStatus}
                  </span>
                </td>
                <td>{new Date(req.requestTime).toLocaleString()}</td>
                <td className="space-x-2">
                  <button
                    disabled={req.requestStatus !== "pending"}
                    onClick={() => handleAction(req._id, "approve")}
                    className="btn btn-success btn-sm"
                  >
                    Accept
                  </button>
                  <button
                    disabled={req.requestStatus !== "pending"}
                    onClick={() => handleAction(req._id, "reject")}
                    className="btn btn-error btn-sm"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageRequests;
