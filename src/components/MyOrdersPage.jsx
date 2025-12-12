import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

const MyOrdersPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();
  const navigate = useNavigate();

  const { data: orders = [], isLoading, refetch } = useQuery({
    queryKey: ["myOrders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/user/${user?.email}`);
      return res.data;
    },
  });

  if (isLoading)
    return <div className="text-center py-20 text-xl">Loading orders...</div>;

  const handleRefresh = () => {
    refetch();
    Swal.fire("Updated!", "Order list refreshed successfully.", "success");
  };

  const handlePay = async (order) => {
    try {
      const res = await axiosSecure.post("/create-payment-intent", {
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
      console.log(error)
      Swal.fire("Error", "Payment redirect failed!", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-orange-600 text-center mb-10">
        My Orders
      </h2>

      <div className="text-center mb-6">
        <button
          onClick={handleRefresh}
          className="btn bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
        >
          Refresh Orders
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">You have no orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-2xl shadow-lg hover:shadow-2xl transition p-6"
            >
              <h3 className="text-2xl font-semibold text-orange-500 mb-3">
                {order.mealName}
              </h3>

              <div className="space-y-2 text-gray-700">
                <p>
                  <b>Food Name:</b> {order.mealName}
                </p>
                <p>
                  <b>Order Status:</b> {order.orderStatus}
                </p>
                <p>
                  <b>Price:</b> ${order.price}
                </p>
                <p>
                  <b>Quantity:</b> {order.quantity}
                </p>
                <p>
                  <b>Delivery Time:</b> {new Date(order.orderTime).toLocaleString()}
                </p>
                <p>
                  <b>Chef ID:</b> {order.chefId}
                </p>
                <p>
                  <b>Payment Status:</b>{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.paymentStatus === "paid" ? "bg-green-600" : "bg-red-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </p>
              </div>

              {order.orderStatus === "accepted" && order.paymentStatus === "Pending" && (
                <div className="mt-5">
                  <button
                    onClick={() => handlePay(order)}
                    className="btn w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
                  >
                    Pay Now
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
