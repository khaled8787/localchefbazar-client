import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosPublic from "../AxiosSecure";

const UpdateMealModal = ({ meal, close, refetch }) => {
  const axios = useAxiosPublic();

  const [form, setForm] = useState({
    foodName: meal.foodName,
    foodImage: meal.foodImage,
    price: meal.price,
    rating: meal.rating,
    ingredients: meal.ingredients,
    deliveryTime: meal.deliveryTime,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔧 Update Meal
  const handleUpdate = async (e) => {
    e.preventDefault();

    const res = await axios.put(`/meals/${meal._id}`, form);

    if (res.data.modifiedCount > 0) {
      Swal.fire("Updated!", "Meal updated successfully", "success");
      refetch();
      close();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Update Meal</h2>

        <form onSubmit={handleUpdate} className="space-y-3">

          <input
            type="text"
            name="foodName"
            value={form.foodName}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Food Name"
          />

          <input
            type="text"
            name="foodImage"
            value={form.foodImage}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Image URL"
          />

          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Price"
          />

          <input
            type="number"
            name="rating"
            value={form.rating}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Rating"
          />

          <input
            type="text"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Ingredients"
          />

          <input
            type="text"
            name="deliveryTime"
            value={form.deliveryTime}
            onChange={handleChange}
            className="input input-bordered w-full"
            placeholder="Delivery Time"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={close}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary text-white"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMealModal;
