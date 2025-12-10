import React, { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

const CreateMeal = () => {
  const { user } = useContext(AuthContext);

  // Form states
  const [foodName, setFoodName] = useState("");
  const [chefName, setChefName] = useState(user?.displayName || "");
  const [foodImage, setFoodImage] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [ingredients, setIngredients] = useState([""]);
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState("");
  const [chefExperience, setChefExperience] = useState("");
  const [deliveryArea, setDeliveryArea] = useState(""); // নতুন field
  const [submitting, setSubmitting] = useState(false);

  // Ingredient handlers
  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (index) => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("User not found!");

    setSubmitting(true);

    try {
      const mealData = {
        foodName,
        chefName,
        foodImage,
        price: parseFloat(price),
        rating: parseFloat(rating),
        ingredients: ingredients.filter((i) => i.trim() !== ""),
        estimatedDeliveryTime,
        chefExperience,
        deliveryArea, // save in MongoDB
        chefId: user?._id,
        userEmail: user?.email,
        createdAt: new Date().toISOString(),
      };

      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/meals`,
        mealData
      );

      console.log("Server response:", res.data);

      if (res.data.result?.insertedId) {
        toast.success("Meal created successfully!");

        // Reset form
        setFoodName("");
        setFoodImage("");
        setPrice("");
        setRating(0);
        setIngredients([""]);
        setEstimatedDeliveryTime("");
        setChefExperience("");
        setDeliveryArea(""); // reset
      } else {
        toast.error("Failed to create meal. Server returned no insertedId.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create meal. See console for details.");
    }

    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-orange-600 mb-6 text-center">
        Create New Meal
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 space-y-6"
      >
        {/* Food Name */}
        <div>
          <label className="font-semibold text-gray-700">Food Name</label>
          <input
            type="text"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="Enter food name"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Chef Name */}
        <div>
          <label className="font-semibold text-gray-700">Chef Name</label>
          <input
            type="text"
            value={chefName}
            onChange={(e) => setChefName(e.target.value)}
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Food Image URL */}
        <div>
          <label className="font-semibold text-gray-700">Food Image URL</label>
          <input
            type="text"
            value={foodImage}
            onChange={(e) => setFoodImage(e.target.value)}
            placeholder="Enter image URL"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="font-semibold text-gray-700">Price ($)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            className="w-full border rounded-lg p-2 mt-1"
            required
            step="0.01"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="font-semibold text-gray-700">Rating</label>
          <input
            type="number"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            placeholder="Enter rating"
            className="w-full border rounded-lg p-2 mt-1"
            min="0"
            max="5"
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className="font-semibold text-gray-700">Ingredients</label>
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mt-1">
              <input
                type="text"
                value={ingredient}
                onChange={(e) =>
                  handleIngredientChange(index, e.target.value)
                }
                placeholder="Enter ingredient"
                className="flex-1 border rounded-lg p-2"
                required
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
          >
            Add Ingredient
          </button>
        </div>

        {/* Estimated Delivery Time */}
        <div>
          <label className="font-semibold text-gray-700">
            Estimated Delivery Time
          </label>
          <input
            type="text"
            value={estimatedDeliveryTime}
            onChange={(e) => setEstimatedDeliveryTime(e.target.value)}
            placeholder="e.g., 30 minutes"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Delivery Area */}
        <div>
          <label className="font-semibold text-gray-700">
            Delivery Area
          </label>
          <input
            type="text"
            value={deliveryArea}
            onChange={(e) => setDeliveryArea(e.target.value)}
            placeholder="Enter delivery area"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* Chef Experience */}
        <div>
          <label className="font-semibold text-gray-700">Chef Experience</label>
          <input
            type="text"
            value={chefExperience}
            onChange={(e) => setChefExperience(e.target.value)}
            placeholder="e.g., 5 years experience"
            className="w-full border rounded-lg p-2 mt-1"
            required
          />
        </div>

        {/* User Email (read-only) */}
        <div>
          <label className="font-semibold text-gray-700">User Email</label>
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
          >
            {submitting ? "Submitting..." : "Create Meal"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateMeal;
