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
    ingredients: meal.ingredients.join(", "), // string for input
    estimatedDeliveryTime: meal.estimatedDeliveryTime,
    chefExperience: meal.chefExperience,
    deliveryArea: meal.deliveryArea,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const updatedMeal = {
        ...form,
        ingredients: form.ingredients.split(",").map((i) => i.trim()),
        price: parseFloat(form.price),
        rating: parseFloat(form.rating),
      };

      const res = await axios.put(`/meals/${meal._id}`, updatedMeal);

      if (res.data.modifiedCount > 0) {
        Swal.fire("Updated!", "Meal updated successfully", "success");
        refetch();
        close();
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update meal.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-md p-6 rounded-2xl shadow-2xl animate-fadeIn">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Update Meal
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            name="foodName"
            value={form.foodName}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Food Name"
            required
          />

          <input
            type="text"
            name="foodImage"
            value={form.foodImage}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Image URL"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Price"
              step="0.01"
              required
            />
            <input
              type="number"
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Rating"
              min="0"
              max="5"
            />
          </div>

          <input
            type="text"
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Ingredients (comma separated)"
            required
          />

          <input
            type="text"
            name="estimatedDeliveryTime"
            value={form.estimatedDeliveryTime}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Estimated Delivery Time"
            required
          />

          <input
            type="text"
            name="chefExperience"
            value={form.chefExperience}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Chef Experience"
          />

          <input
            type="text"
            name="deliveryArea"
            value={form.deliveryArea}
            onChange={handleChange}
            className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
            placeholder="Delivery Area"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={close}
              className="px-5 py-2 rounded-xl border hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateMealModal;
