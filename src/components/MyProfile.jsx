import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { user, loading } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    photo: "",
  });

  useEffect(() => {
    if (!user?.email) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_SERVER_URL}/users/${user.email}`
        );
        setUserData(res.data);
        setFormData({
          name: res.data.name || "",
          address: res.data.address || "",
          photo: res.data.photo || "",
        });
      } catch {
        toast.error("Failed to load profile");
      }
    };

    if (!loading) fetchUser();
  }, [user, loading]);

  const sendRequest = async (type) => {
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

      res.data.success
        ? toast.success(`Request sent for ${type}`)
        : toast.error("Request failed");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER_URL}/users/${userData._id}`,
        formData
      );

      if (res.data.modifiedCount > 0) {
        toast.success("Profile updated successfully");
        setUserData({ ...userData, ...formData });
        setOpenEdit(false);
      } else {
        toast.info("No changes made");
      }
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <span className="loading loading-spinner loading-lg text-orange-400"></span>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-20 flex justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-5xl bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 lg:p-12"
      >
        <h2 className="text-4xl font-extrabold text-orange-400 text-center mb-10">
          My Profile
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-10">
          <img
            src={userData.photo || "https://via.placeholder.com/200"}
            className="w-44 h-44 rounded-full border-4 border-orange-400 shadow-xl"
          />

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
            <Info label="Name" value={userData.name} />
            <Info label="Email" value={userData.email} />
            <Info label="Address" value={userData.address || "N/A"} />
            <Info label="Role" value={userData.role} />
            <Info label="Status" value={userData.status || "active"} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-5 mt-12">
          <ActionBtn onClick={() => setOpenEdit(true)} text="Edit Profile" />

          {userData.role !== "chef" && userData.role !== "admin" && (
            <ActionBtn
              onClick={() => sendRequest("chef")}
              text="Request Chef Role"
            />
          )}

          {userData.role !== "admin" && (
            <ActionBtn
              onClick={() => sendRequest("admin")}
              text="Request Admin Role"
              color="yellow"
            />
          )}
        </div>
      </motion.div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {openEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          >
            <motion.form
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onSubmit={handleUpdate}
              className="bg-gray-900 rounded-3xl p-8 w-full max-w-md space-y-5"
            >
              <h3 className="text-2xl font-bold text-orange-400 text-center">
                Edit Profile
              </h3>

              <Input
                label="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Input
                label="Photo URL"
                value={formData.photo}
                onChange={(e) =>
                  setFormData({ ...formData, photo: e.target.value })
                }
              />

              <Input
                label="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setOpenEdit(false)}
                  className="flex-1 py-3 rounded-xl bg-gray-700 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 rounded-xl bg-orange-400 text-gray-900 font-bold"
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

/* ---------- Reusable ---------- */

const Info = ({ label, value }) => (
  <div className="bg-gray-800/70 p-5 rounded-2xl border border-gray-700">
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

const ActionBtn = ({ text, onClick, color = "orange" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-8 py-3 rounded-xl font-bold text-gray-900 shadow-lg
      ${color === "yellow" ? "bg-yellow-400" : "bg-orange-400"}`}
  >
    {text}
  </motion.button>
);

const Input = ({ label, ...props }) => (
  <div>
    <label className="text-sm text-gray-400">{label}</label>
    <input
      {...props}
      className="w-full mt-1 p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-orange-400 outline-none"
    />
  </div>
);

export default Profile;
