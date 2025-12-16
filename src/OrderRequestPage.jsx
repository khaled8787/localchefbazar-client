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
  });

  const { data: orders = [], refetch, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data; 
    },
  });

  if (mealsLoading || ordersLoading)
    return <div className="text-center py-10">Loading...</div>;

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

  const isCancelDisabled = (status) => status !== "pending";
  const isAcceptDisabled = (status) => status !== "pending";
  const isDeliverDisabled = (status) => status !== "accepted";

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-orange-600">
        Order Requests
      </h2>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-lg p-5 border border-gray-100"
            >
              <p>
                <b>Food Name:</b> {order.mealName}
              </p>
              <p>
                <b>Price:</b> ${order.price}
              </p>
              <p>
                <b>Quantity:</b> {order.quantity}
              </p>
              <p>
                <b>Status:</b> {order.orderStatus}
              </p>
              <p>
                <b>User Email:</b> {order.userEmail}
              </p>
              <p>
                <b>Order Time:</b>{" "}
                {new Date(order.orderTime).toLocaleString()}
              </p>
              <p>
                <b>Address:</b> {order.userAddress}
              </p>
              <p>
                <b>Payment Status:</b> {order.paymentStatus}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  className={`flex-1 btn btn-error ${
                    isCancelDisabled(order.orderStatus)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isCancelDisabled(order.orderStatus)}
                  onClick={() => handleStatusChange(order._id, "cancelled")}
                >
                  Cancel
                </button>

                <button
                  className={`flex-1 btn btn-success ${
                    isAcceptDisabled(order.orderStatus)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isAcceptDisabled(order.orderStatus)}
                  onClick={() => handleStatusChange(order._id, "accepted")}
                >
                  Accept
                </button>

                <button
                  className={`flex-1 btn btn-warning ${
                    isDeliverDisabled(order.orderStatus)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={isDeliverDisabled(order.orderStatus)}
                  onClick={() => handleStatusChange(order._id, "delivered")}
                >
                  Deliver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderRequestsPage;
