import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user?.email) return; 

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${user.email}`
        );
        setUserData(res.data);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        toast.error("Failed to load user data");
      }
    };

    if (!loading && user?.email) {
      fetchUser();
    }
  }, [user, loading]);

  const sendRequest = async (type) => {
    if (!userData) return;
    setUpdating(true);
    try {
      const payload = {
        userId: userData._id,
        userName: userData.name,
        userEmail: userData.email,
        requestType: type,
        requestStatus: "pending",
        requestTime: new Date().toISOString(),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/requests`,
        payload
      );

      if (res.data.success) {
        toast.success(`Request for "${type}" sent successfully!`);
      } else {
        toast.error("Failed to send request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to send request");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !userData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-xl"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 flex flex-col lg:flex-row gap-6 items-center">
        <div className="flex-shrink-0">
          <img
            src={userData.photo || "https://via.placeholder.com/150"}
            alt={userData.name}
            className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 shadow-md"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-orange-600">{userData.name}</h2>
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Address:</span> {userData.address || "N/A"}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Role:</span> {userData.role}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Status:</span> {userData.status || "active"}
          </p>
          {userData.role === "chef" && (
            <p className="text-gray-700">
              <span className="font-semibold">Chef ID:</span> {userData._id}
            </p>
          )}

          <div className="flex gap-4 mt-4">
            {userData.role !== "chef" && userData.role !== "admin" && (
              <button
                onClick={() => sendRequest("chef")}
                disabled={updating}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                {updating ? "Processing..." : "Be a Chef"}
              </button>
            )}

            {userData.role !== "admin" && (
              <button
                onClick={() => sendRequest("admin")}
                disabled={updating}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
              >
                {updating ? "Processing..." : "Be an Admin"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
