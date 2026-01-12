import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosPublic from "./AxiosSecure";
import { AuthContext } from "./AuthContext";
import { motion } from "framer-motion";

const OrderRequestsPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();

  const { data: chefMeals = [], isLoading: mealsLoading } = useQuery({
    queryKey: ["chefMeals"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/by-chef/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: orders = [], refetch, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data;
    },
  });

  if (mealsLoading || ordersLoading)
    return (
      <div className="text-center py-20 text-xl text-gray-300">
        Loading orders...
      </div>
    );

  const chefMealIds = chefMeals.map((meal) => meal._id);
  const filteredOrders = orders.filter((order) =>
    chefMealIds.includes(order.chefId)
  );

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosSecure.patch(`/orders/${orderId}/status`, { status: newStatus });
      Swal.fire("Success", `Order ${newStatus} successfully!`, "success");
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update order.", "error");
    }
  };

  const statusButtonProps = (status) => ({
    cancel: { disabled: status !== "pending", color: "bg-red-500 hover:bg-red-600" },
    accept: { disabled: status !== "pending", color: "bg-green-500 hover:bg-green-600" },
    deliver: { disabled: status !== "accepted", color: "bg-yellow-500 hover:bg-yellow-600" },
  });

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-6 py-10">
      {/* Background Animated Circles */}
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

      <div className="relative z-10 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8 text-orange-400 drop-shadow-[0_0_15px_rgba(255,165,0,0.7)]">
          Order Requests
        </h2>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-400">No orders yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const { cancel, accept, deliver } = statusButtonProps(order.orderStatus);
              return (
                <motion.div
                  key={order._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-5 transition"
                >
                  <p className="text-gray-200"><b>Food Name:</b> {order.mealName}</p>
                  <p className="text-gray-200"><b>Price:</b> ${order.price}</p>
                  <p className="text-gray-200"><b>Quantity:</b> {order.quantity}</p>
                  <p className="text-gray-200"><b>Status:</b> {order.orderStatus}</p>
                  <p className="text-gray-200"><b>User Email:</b> {order.userEmail}</p>
                  <p className="text-gray-200"><b>Order Time:</b> {new Date(order.orderTime).toLocaleString()}</p>
                  <p className="text-gray-200"><b>Address:</b> {order.userAddress}</p>
                  <p className="text-gray-200">
                    <b>Payment Status:</b>{" "}
                    <span className={`px-2 py-1 rounded text-white ${
                      order.paymentStatus === "paid" ? "bg-green-600" : "bg-red-500"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </p>

                  <div className="mt-4 flex gap-2">
                    <button
                      disabled={cancel.disabled}
                      onClick={() => handleStatusChange(order._id, "cancelled")}
                      className={`flex-1 text-white font-semibold py-2 rounded-xl ${cancel.color} ${cancel.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Cancel
                    </button>

                    <button
                      disabled={accept.disabled}
                      onClick={() => handleStatusChange(order._id, "accepted")}
                      className={`flex-1 text-white font-semibold py-2 rounded-xl ${accept.color} ${accept.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Accept
                    </button>

                    <button
                      disabled={deliver.disabled}
                      onClick={() => handleStatusChange(order._id, "delivered")}
                      className={`flex-1 text-white font-semibold py-2 rounded-xl ${deliver.color} ${deliver.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      Deliver
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderRequestsPage;
