import React, { useState, useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

const MyReviewPage = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosPublic = useAxiosPublic();

  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchReviews = async () => {
    if (!user?.displayName) return;

    setIsLoading(true);
    try {
      const res = await axiosPublic.get("/reviews");

      const myReviews = res.data.filter(
        (review) => review.reviewerName === user.displayName
      );

      setReviews(myReviews);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch reviews", "error");
    } finally {
      setIsLoading(false);
    }
  };

  fetchReviews();
}, [user, axiosPublic]);

  if (loading || isLoading) {
    return <div className="text-center py-20 text-xl">Loading reviews...</div>;
  }

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f87171",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosPublic.delete(`/reviews/${id}`);
        setReviews(reviews.filter((r) => r._id !== id));
        Swal.fire("Deleted!", "Your review has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete review.", "error");
      }
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleUpdate = async () => {
    if (!rating || !comment) {
      Swal.fire("Error", "Rating and comment cannot be empty", "error");
      return;
    }

    try {
      await axiosPublic.patch(`/reviews/${editingReview._id}`, {
        rating,
        comment,
      });

      setReviews(
        reviews.map((r) =>
          r._id === editingReview._id
            ? { ...r, rating, comment }
            : r
        )
      );

      setEditingReview(null);
      Swal.fire("Updated!", "Your review has been updated.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update review.", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-orange-600 text-center mb-10">
        My Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-center text-gray-500">
          You have not submitted any reviews yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="bg-white border rounded-2xl shadow-lg p-6"
            >
              <h3 className="text-xl font-semibold text-orange-500 mb-2">
                Meal Name: {review.foodName}
              </h3>
              <p><b>Rating:</b> {review.rating} ⭐</p>
              <p><b>Comment:</b> {review.comment}</p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="flex-1 btn btn-warning text-white"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="flex-1 btn btn-error text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              Edit Review
            </h3>

            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingReview(null)}
                className="btn"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-success text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviewPage;
