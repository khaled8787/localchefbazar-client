import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FiTrash2, FiUserX, FiUserCheck } from "react-icons/fi";
import useAxiosPublic from "../AxiosSecure";

const Chefs = () => {
  const axiosInstance = useAxiosPublic();

  const { data: chefs = [], refetch, isLoading } = useQuery({
    queryKey: ["all-chefs"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/chefs");
      return data;
    },
  });

  const handleToggleStatus = async (chef) => {
    try {
      const newStatus = chef.status === "active" ? "inactive" : "active";
      await axiosInstance.put(`/chefs/status/${chef._id}`, { status: newStatus });
      Swal.fire("Success", `Chef is now ${newStatus}`, "success");
      refetch();
    } catch (err) {
      console.error("Toggle status failed:", err);
      Swal.fire("Error", "Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axiosInstance.delete(`/users/${id}`);
        Swal.fire("Deleted!", "Chef has been deleted.", "success");
        refetch();
      } catch (err) {
        console.error("Delete failed:", err);
        Swal.fire("Error", "Failed to delete chef", "error");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center mt-10">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-5">All Chefs</h2>
      <div className="overflow-x-auto shadow-lg rounded-xl border">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr className="text-lg">
              <th>#</th>
              <th>Chef</th>
              <th>Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map((chef, idx) => (
              <tr key={chef._id} className="hover">
                <td>{idx + 1}</td>
                <td className="flex items-center gap-3">
                  <img
                    src={chef.photo || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">{chef.name}</p>
                  </div>
                </td>
                <td>{chef.email}</td>
                <td className="capitalize font-semibold">{chef.status || "active"}</td>
                <td className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(chef)}
                    className={`btn btn-sm ${
                      chef.status === "active" ? "btn-warning" : "btn-success"
                    } flex items-center gap-1`}
                  >
                    {chef.status === "active" ? <FiUserX /> : <FiUserCheck />}
                    {chef.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => handleDelete(chef._id)}
                    className="btn btn-sm btn-error flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
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

export default Chefs;
