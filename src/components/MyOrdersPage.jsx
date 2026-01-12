import React, { useContext, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

const MyOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["myOrders", user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const res = await axiosPublic.get(`/orders/user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  const handleRefresh = () => {
    refetch();
    Swal.fire("Updated!", "Order list refreshed successfully.", "success");
  };

  const handlePay = async (order) => {
    try {
      const res = await axiosPublic.post("/create-payment-intent", {
        price: order.price,
        orderId: order._id,
        userEmail: user.email,
      });

      const clientSecret = res.data.clientSecret;

      if (!clientSecret) {
        Swal.fire("Error", "Stripe payment initialization failed!", "error");
        return;
      }

      navigate(`/payment/${order._id}`, {
        state: { clientSecret, orderId: order._id },
      });
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Payment redirect failed!", "error");
    }
  };

  return (
    <section className="min-h-screen relative bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50 py-10 px-4 md:px-10">
      
      {/* Animated background circles */}
      <motion.div
        className="absolute w-40 h-40 bg-orange-400/20 rounded-full top-10 left-10 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute w-60 h-60 bg-yellow-400/20 rounded-full bottom-20 right-20 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute w-32 h-32 bg-purple-400/20 rounded-full top-1/2 left-1/2 blur-3xl"
        animate={{ y: [-10, 10, -10], x: [10, -10, 10] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      />

      <h2 className="text-4xl md:text-5xl font-bold text-orange-600 text-center mb-10 relative z-10">
        My Orders
      </h2>

      <div className="text-center mb-6 relative z-10">
        <button
          onClick={handleRefresh}
          className="btn bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl px-6 py-2 shadow-lg transition-all"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 mt-20 relative z-10">
          You have no orders yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              className="relative bg-white/80 backdrop-blur-xl border border-orange-100 shadow-2xl rounded-3xl overflow-hidden hover:scale-[1.03] transition-all duration-300"
              whileHover={{ scale: 1.03 }}
            >
              {/* Card Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl"></div>

              <div className="p-6 space-y-3">
                <h3 className="text-2xl font-bold text-orange-500">
                  {order.mealName || order.items?.[0]?.name || "Meal Name"}
                </h3>

                <p className="text-gray-700"><b>Food Name:</b> {order.mealName || order.items?.[0]?.name}</p>
                <p className="text-gray-700"><b>Order Status:</b> {order.orderStatus || "pending"}</p>
                <p className="text-gray-700"><b>Price:</b> ${order.price || order.totalPrice}</p>
                <p className="text-gray-700"><b>Quantity:</b> {order.quantity || order.items?.length || 1}</p>
                <p className="text-gray-700"><b>Delivery Time:</b> {new Date(order.orderTime || order.createdAt).toLocaleString()}</p>
                <p className="text-gray-700"><b>Chef ID:</b> {order.chefId || "N/A"}</p>
                <p className="text-gray-700">
                  <b>Payment Status:</b>{" "}
                  <span className={`px-2 py-1 rounded text-white ${order.paymentStatus === "paid" ? "bg-green-600" : "bg-red-500"}`}>
                    {order.paymentStatus || "unpaid"}
                  </span>
                </p>

                {(order.orderStatus === "accepted" && order.paymentStatus !== "paid") && (
                  <button
                    onClick={() => handlePay(order)}
                    className="btn w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl mt-4 shadow-lg transition-all"
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrdersPage;
