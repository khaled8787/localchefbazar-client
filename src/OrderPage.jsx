import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./AxiosSecure";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { motion } from "framer-motion";

const OrderPage = () => {
  const { mealId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${mealId}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );

  const handleOrder = async () => {
    if (!address.trim()) {
      return Swal.fire("Error", "Please enter your delivery address.", "error");
    }

    const totalPrice = meal.price * quantity;

    const result = await Swal.fire({
      title: "Confirm Your Order",
      html: `
        <p><b>Meal:</b> ${meal.foodName}</p>
        <p><b>Quantity:</b> ${quantity}</p>
        <p style="color:#f97316;font-size:18px"><b>Total:</b> $${totalPrice}</p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirm Order",
    });

    if (!result.isConfirmed) return;

    const orderData = {
      foodId: meal._id,
      mealName: meal.foodName,
      price: meal.price,
      quantity,
      chefId: meal._id,
      paymentStatus: "Pending",
      userEmail: user.email,
      userAddress: address,
      orderStatus: "pending",
      orderTime: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/orders", orderData);
      if (res.data.insertedId) {
        Swal.fire("Success!", "Order placed successfully!", "success");
        setQuantity(1);
        setAddress("");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white text-center">
          <h2 className="text-3xl font-bold">Confirm Your Order</h2>
          <p className="opacity-90">Review meal & delivery details</p>
        </div>

        {/* Content */}
        <div className="p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Meal Info */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-50 rounded-2xl p-6 shadow-inner"
          >
            <img
              src={meal.foodImage}
              alt={meal.foodName}
              className="w-full h-56 object-cover rounded-xl shadow mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800">
              {meal.foodName}
            </h3>
            <p className="text-gray-600 mt-2">
              <b>Price:</b> ${meal.price}
            </p>
            <p className="text-gray-600">
              <b>User:</b> {user.email}
            </p>
          </motion.div>

          {/* Order Form */}
          <div className="space-y-5 text-black">
            <div>
              <label className="font-semibold text-gray-700">Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700">
                Delivery Address
              </label>
              <textarea
                rows="4"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your delivery address"
                className="w-full mt-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-orange-400 outline-none resize-none"
              />
            </div>

            <div className="bg-orange-50 p-4 rounded-xl text-center">
              <p className="text-xl font-bold text-orange-600">
                Total: ${meal.price * quantity}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOrder}
              className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl shadow-lg text-lg"
            >
              Confirm Order
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderPage;
