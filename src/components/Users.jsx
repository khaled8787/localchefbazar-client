import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiTrash2, FiUserCheck, FiAlertTriangle } from "react-icons/fi";
import useAxiosPublic from "../AxiosSecure";
import Swal from "sweetalert2";

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
      <div className="flex justify-center mt-10">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-5">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">
        Manage Users
      </h2>

      <div className="overflow-x-auto shadow-xl rounded-2xl border">
        <table className="table w-full">
          <thead className="bg-base-200 text-lg">
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
              <tr key={user._id} className="hover">
                <td>{idx + 1}</td>

                <td className="flex items-center gap-3">
                  <img
                    src={user.photo || "https://i.ibb.co/4pDNDk1/avatar.png"}
                    className="w-12 h-12 rounded-full border"
                  />
                  <p className="font-semibold">{user.name}</p>
                </td>

                <td>{user.email}</td>

                <td className="capitalize font-semibold">{user.role}</td>

                <td>
                  {user.status === "fraud" ? (
                    <span className="badge badge-error text-white">Fraud</span>
                  ) : (
                    <span className="badge badge-success text-white">
                      Active
                    </span>
                  )}
                </td>

                <td className="flex flex-wrap justify-center gap-2">
                  {user.role !== "admin" && (
                    <>
                      <button
                        onClick={() => handleMakeAdmin(user._id)}
                        className="btn btn-xs btn-info"
                      >
                        <FiUserCheck /> Admin
                      </button>

                      <button
                        onClick={() => handleMakeChef(user._id)}
                        className="btn btn-xs btn-success"
                      >
                        <FiUserCheck /> Chef
                      </button>
                    </>
                  )}

                  {user.role !== "admin" && user.status !== "fraud" && (
                    <button
                      onClick={() => handleMakeFraud(user._id)}
                      className="btn btn-xs btn-warning"
                    >
                      <FiAlertTriangle /> Fraud
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(user._id)}
                    className="btn btn-xs btn-error"
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
