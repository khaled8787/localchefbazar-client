import React, { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "./AuthContext";
import useAxiosPublic from "./AxiosSecure";
import { useNavigate } from "react-router";

const MealDetailsModal = ({ meal, close }) => {
  const axiosSecure = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState(user?.displayName || "");
  const [reviewerImage, setReviewerImage] = useState(user?.photoURL || "");
  const [rating, setRating] = useState(0);

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (user) {
      setReviewerName(user.displayName || "");
      setReviewerImage(
        user.photoURL || "https://i.ibb.co/2Yf6s0b/default-avatar.png"
      );
    }
  }, [user]);

  useEffect(() => {
    if (!meal?._id) return;

    axiosSecure
      .get(`/reviews/by-meal?mealId=${meal._id}`)
      .then(res => {
        setReviews(res.data);
      });
  }, [meal._id, axiosSecure]);

  const handleSubmitReview = async () => {
    if (!reviewerName.trim() || !reviewText.trim() || rating === 0)
      return Swal.fire("Error", "Please fill all fields", "error");

    const newReview = {
      foodId: meal._id,
      foodName: meal.foodName,
      reviewerName,
      reviewerImage:
        reviewerImage || "https://i.ibb.co/2Yf6s0b/default-avatar.png",
      rating,
      comment: reviewText,
      date: new Date(),
    };

    try {
      const res = await axiosSecure.post("/reviews", newReview);

      if (res.data.insertedId) {
        setReviews([newReview, ...reviews]);
        Swal.fire("Success!", "Review submitted successfully!", "success");
        setReviewText("");
        setRating(0);
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  const handleAddToFavorite = async () => {
    const favoriteData = {
      userEmail: user?.email,
      mealId: meal._id,
      mealName: meal.foodName,
      chefId: meal.chefId,
      chefName: meal.chefName,
      price: meal.price,
      addedTime: new Date().toISOString(),
    };

    try {
      const res = await axiosSecure.post("/favorites", favoriteData);

      if (res.data.insertedId) {
        Swal.fire("Success!", "Meal added to favorites!", "success");
      } else if (res.data.message === "already_exist") {
        Swal.fire("Info", "This meal is already in your favorites!", "info");
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-11/12 md:w-4/5 lg:w-3/4 max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-6">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold">{meal.foodName}</h2>
          <button onClick={close} className="btn btn-ghost text-xl">✖</button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <img
            src={meal.foodImage}
            alt={meal.foodName}
            className="w-full lg:w-1/3 h-64 object-cover rounded-lg"
          />

          <div className="flex-1 space-y-2">
            <p><strong>Chef:</strong> {meal.chefName}</p>
            <p><strong>Chef ID:</strong> {meal.chefId}</p>
            <p><strong>Price:</strong> ${meal.price}</p>
            <p><strong>Rating:</strong> ⭐ {meal.rating}</p>
            <p><strong>Ingredients:</strong> {meal.ingredients}</p>
            <p><strong>Delivery Areas:</strong> {meal.deliveryArea}</p>
            <p><strong>Estimated Delivery Time:</strong> {meal.estimatedDeliveryTime}</p>
            <p><strong>Chef Experience:</strong> {meal.chefExperience}</p>

            <div className="flex gap-3 mt-4">
              <button onClick={() => navigate(`/order/${meal._id}`)} className="btn btn-success w-1/2">Order Now</button>
              <button onClick={handleAddToFavorite} className="btn btn-error w-1/2">
                ❤️ Favorite
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="border rounded-xl p-4 max-h-[400px] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Reviews</h3>

            {reviews.length > 0 ? reviews.map((r, index) => (
              <div key={index} className="border p-3 rounded-lg bg-gray-50 flex gap-3 mb-3">
                <img
                  src={r.reviewerImage}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-bold">{r.reviewerName}</p>
                  <p className="text-yellow-500">
                    {"⭐".repeat(r.rating)}{" "}
                    <span className="text-gray-500 text-sm">
                      {new Date(r.date).toLocaleDateString()}
                    </span>
                  </p>
                  <p>{r.comment}</p>
                </div>
              </div>
            )) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-gray-50 space-y-3">
            <input
              type="text"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Your name"
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="text"
              value={reviewerImage}
              onChange={(e) => setReviewerImage(e.target.value)}
              placeholder="Your image URL (optional)"
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex gap-1 text-2xl">
              {[1,2,3,4,5].map(num => (
                <span
                  key={num}
                  onClick={() => setRating(num)}
                  className={`cursor-pointer ${num <= rating ? "text-yellow-500" : "text-gray-400"}`}
                >★</span>
              ))}
            </div>

            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review..."
              className="w-full border p-2 rounded-lg"
            />

            <button onClick={handleSubmitReview} className="btn btn-primary w-full">
              Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealDetailsModal;
