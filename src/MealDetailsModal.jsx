import React, { useState } from "react";
import Swal from "sweetalert2";

const MealDetailsModal = ({ meal, close }) => {
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState(meal.reviews || []); // assuming meal has reviews array

  const handleSubmitReview = () => {
    if (!reviewText.trim()) return;
    const newReview = {
      id: Date.now(),
      text: reviewText,
      date: new Date().toLocaleString(),
    };
    setReviews([newReview, ...reviews]);
    setReviewText("");
    Swal.fire("Thanks!", "Your review has been added.", "success");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">{meal.foodName}</h2>
          <button onClick={close} className="btn btn-ghost text-xl">✖</button>
        </div>

        {/* Meal Info */}
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={meal.foodImage}
            alt={meal.foodName}
            className="w-full md:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="flex-1 space-y-2">
            <p><strong>Chef:</strong> {meal.chefName}</p>
            <p><strong>Chef ID:</strong> {meal.chefId}</p>
            <p><strong>Price:</strong> ${meal.price}</p>
            <p><strong>Rating:</strong> ⭐ {meal.rating}</p>
            <p><strong>Ingredients:</strong> {meal.ingredients?.join(", ")}</p>
            <p><strong>Delivery Areas:</strong> {meal.deliveryAreas?.join(", ")}</p>
            <p><strong>Estimated Delivery Time:</strong> {meal.estimatedDeliveryTime}</p>
            <p><strong>Chef Experience:</strong> {meal.chefExperience}</p>

            <button className="btn btn-success mt-4 w-full">
              Order Now
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-2">Reviews</h3>

          <div className="space-y-2 mb-4">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className="border p-2 rounded-lg bg-gray-50">
                  <p>{r.text}</p>
                  <span className="text-xs text-gray-400">{r.date}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write a review..."
              className="flex-1 border rounded-lg p-2"
            />
            <button
              onClick={handleSubmitReview}
              className="btn btn-primary"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;
