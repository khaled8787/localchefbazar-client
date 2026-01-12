import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import { toast } from "react-toastify";
import useAxiosPublic from "../AxiosSecure";
import { FaPlus, FaTrash, FaUtensils } from "react-icons/fa";
import { motion } from "framer-motion";

const CreateMeal = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();

  const [foodName, setFoodName] = useState("");
  const [foodImage, setFoodImage] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [ingredients, setIngredients] = useState([""]);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [chefExperience, setChefExperience] = useState("");
  const [deliveryArea, setDeliveryArea] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleIngredientChange = (index, value) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) =>
    setIngredients(ingredients.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return toast.error("User not logged in!");

    setSubmitting(true);
    try {
      const mealData = {
        foodName,
        chefName: user.displayName,
        chefEmail: user.email,
        foodImage,
        price: parseFloat(price),
        rating: parseFloat(rating),
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        estimatedDeliveryTime,
        chefExperience,
        deliveryArea,
      };

      const res = await axiosSecure.post("/meals", mealData);

      if (res.data.success || res.data.result?.insertedId) {
        toast.success("Meal created successfully!");
        setFoodName("");
        setFoodImage("");
        setPrice("");
        setRating(0);
        setIngredients([""]);
        setEstimatedDeliveryTime("");
        setChefExperience("");
        setDeliveryArea("");
      } else {
        toast.error("Failed to create meal.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create meal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-10">
      {/* Animated Background Circles */}
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

      <div className="relative z-10 w-full max-w-5xl bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700 p-6 md:p-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg">
            <FaUtensils size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-orange-400 drop-shadow-[0_0_15px_rgba(255,165,0,0.7)]">
              Create New Meal
            </h2>
            <p className="text-gray-300 text-sm">
              Add a delicious meal for your customers
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Food Name */}
          <div>
            <label className="font-semibold text-gray-300">Food Name</label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
              required
            />
          </div>

          {/* Food Image */}
          <div>
            <label className="font-semibold text-gray-300">Food Image URL</label>
            <input
              type="text"
              value={foodImage}
              onChange={(e) => setFoodImage(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="font-semibold text-gray-300">Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="font-semibold text-gray-300">Rating (0-5)</label>
            <input
              type="number"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
            />
          </div>

          {/* Ingredients */}
          <div className="md:col-span-2">
            <label className="font-semibold text-gray-300">Ingredients</label>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) =>
                    handleIngredientChange(index, e.target.value)
                  }
                  placeholder="Ingredient name"
                  className="flex-1 input input-bordered rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
                  required
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="btn btn-error btn-square rounded-xl"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addIngredient}
              className="mt-3 btn btn-success rounded-xl flex items-center gap-2"
            >
              <FaPlus /> Add Ingredient
            </button>
          </div>

          {/* Delivery Time */}
          <div>
            <label className="font-semibold text-gray-300">
              Estimated Delivery Time
            </label>
            <input
              type="text"
              value={estimatedDeliveryTime}
              onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
              required
            />
          </div>

          {/* Delivery Area */}
          <div>
            <label className="font-semibold text-gray-300">Delivery Area</label>
            <input
              type="text"
              value={deliveryArea}
              onChange={(e) => setDeliveryArea(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
              required
            />
          </div>

          {/* Chef Experience */}
          <div className="md:col-span-2">
            <label className="font-semibold text-gray-300">Chef Experience</label>
            <input
              type="text"
              value={chefExperience}
              onChange={(e) => setChefExperience(e.target.value)}
              className="input input-bordered w-full mt-1 rounded-xl bg-gray-800 text-white border-gray-600 focus:ring-orange-400"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 text-center pt-4">
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-xl transition-all disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Create Meal"}
            </motion.button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreateMeal;
