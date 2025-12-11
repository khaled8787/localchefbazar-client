import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./AxiosSecure";
import Swal from "sweetalert2";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

const OrderPage = () => {
  const { mealId } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [quantity, setQuantity] = useState(1);
  const [address, setAddress] = useState("");

  // Fetch the meal data
  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal", mealId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals/${mealId}`);
      return res.data;
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  // ===== ORDER HANDLER =====
  const handleOrder = async () => {
    if (!address.trim()) {
      return Swal.fire("Error", "Please enter your delivery address.", "error");
    }

    const totalPrice = meal.price * quantity;

    // SweetAlert confirmation
    const result = await Swal.fire({
      title: "Confirm Your Order",
      html: `
        <p class="text-lg">Meal: <b>${meal.foodName}</b></p>
        <p class="text-lg">Quantity: <b>${quantity}</b></p>
        <p class="text-lg text-orange-600">Total Price: <b>$${totalPrice}</b></p>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Confirm",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    // Prepare order data for MongoDB
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
      } else {
        Swal.fire("Error", "Failed to place the order. Try again.", "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Something went wrong. Check console.", "error");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-center">Confirm Your Order</h2>

      {/* Meal Info Card */}
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={meal.foodImage}
          alt={meal.foodName}
          className="w-full md:w-1/3 rounded-xl shadow"
        />

        <div className="flex-1 space-y-2">
          <p><b>Meal:</b> {meal.foodName}</p>
          <p><b>Price:</b> ${meal.price}</p>
          <p><b>Chef ID:</b> {meal._id}</p>
          <p><b>User Email:</b> {user.email}</p>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 space-y-4">
        {/* Quantity */}
        <div>
          <label className="font-semibold">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, +e.target.value))}
            className="input input-bordered w-full mt-1"
          />
        </div>

        {/* Address */}
        <div>
          <label className="font-semibold">Delivery Address</label>
          <textarea
            className="textarea textarea-bordered w-full mt-1"
            rows="3"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your delivery address..."
          />
        </div>

        {/* Total Price */}
        <p className="text-xl font-bold text-orange-600">
          Total Price: ${meal.price * quantity}
        </p>

        <button
          onClick={handleOrder}
          className="btn btn-primary w-full text-lg"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
