import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiTrash2, FiUserCheck } from "react-icons/fi";
import useAxiosPublic from "../AxiosSecure";

const Users = () => {
  const axiosInstance = useAxiosPublic(); // 🔹 Axios instance একবার বানানো
  // 🔥 Fetch all users
  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users"); // JWT attach হবে
      return data;
    },
  });

  // 🔥 Make Admin
  const handleMakeAdmin = async (id) => {
    try {
      await axiosInstance.patch(`/users/admin/${id}`);
      refetch();
    } catch (err) {
      console.error("Make Admin failed:", err);
    }
  };

  // 🔥 Make Chef
  const handleMakeChef = async (id) => {
    try {
      await axiosInstance.patch(`/users/chef/${id}`);
      refetch();
    } catch (err) {
      console.error("Make Chef failed:", err);
    }
  };

  // 🔥 Delete User
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/users/${id}`);
      refetch();
    } catch (err) {
      console.error("Delete failed:", err);
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
      <h2 className="text-3xl font-bold mb-5">All Users</h2>

      <div className="overflow-x-auto shadow-lg rounded-xl border">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr className="text-lg">
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id} className="hover">
                <td>{idx + 1}</td>

                {/* User Info */}
                <td className="flex items-center gap-3">
                  <img
                    src={user.photo || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                </td>

                {/* Email */}
                <td>{user.email}</td>

                {/* Role */}
                <td className="capitalize font-semibold">{user.role}</td>

                {/* Actions */}
                <td className="flex items-center justify-center gap-2">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleMakeAdmin(user._id)}
                      className="btn btn-sm btn-info flex items-center gap-1"
                    >
                      <FiUserCheck /> Admin
                    </button>
                  )}
                  {user.role !== "chef" && (
                    <button
                      onClick={() => handleMakeChef(user._id)}
                      className="btn btn-sm btn-success flex items-center gap-1"
                    >
                      <FiUserCheck /> Chef
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user._id)}
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

export default Users;
