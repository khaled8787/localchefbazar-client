import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosPublic from "./AxiosSecure";
import { AuthContext } from "./AuthContext";

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
    return <div className="text-center py-20 text-xl">Loading orders...</div>;

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
    cancel: { disabled: status !== "pending", color: "btn-error" },
    accept: { disabled: status !== "pending", color: "btn-success" },
    deliver: { disabled: status !== "accepted", color: "btn-warning" },
  });

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        Order Requests
      </h2>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const { cancel, accept, deliver } = statusButtonProps(order.orderStatus);
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-xl p-5 border border-gray-100 hover:shadow-2xl transition"
              >
                <p><b>Food Name:</b> {order.mealName}</p>
                <p><b>Price:</b> ${order.price}</p>
                <p><b>Quantity:</b> {order.quantity}</p>
                <p><b>Status:</b> {order.orderStatus}</p>
                <p><b>User Email:</b> {order.userEmail}</p>
                <p><b>Order Time:</b> {new Date(order.orderTime).toLocaleString()}</p>
                <p><b>Address:</b> {order.userAddress}</p>
                <p><b>Payment Status:</b>{" "}
                  <span className={`px-2 py-1 rounded text-white ${
                    order.paymentStatus === "paid" ? "bg-green-600" : "bg-red-500"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    disabled={cancel.disabled}
                    className={`flex-1 ${cancel.color} ${cancel.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleStatusChange(order._id, "cancelled")}
                  >
                    Cancel
                  </button>

                  <button
                    disabled={accept.disabled}
                    className={`flex-1 ${accept.color} ${accept.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleStatusChange(order._id, "accepted")}
                  >
                    Accept
                  </button>

                  <button
                    disabled={deliver.disabled}
                    className={`flex-1 ${deliver.color} ${deliver.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => handleStatusChange(order._id, "delivered")}
                  >
                    Deliver
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderRequestsPage;
