import React, { useState, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

const MyReviewPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();
  const queryClient = useQueryClient();

  const [editingReview, setEditingReview] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const reviewerName = user?.displayName;

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["myReviews", reviewerName],
    queryFn: async () => {
      const res = await axiosSecure.get(`/reviews/user/${reviewerName}`);
      console.log("API Response:", res.data);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/reviews/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myReviews", reviewerName]);
      Swal.fire("Deleted!", "Your review has been deleted.", "success");
    },
    onError: () => Swal.fire("Error", "Failed to delete review.", "error"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, rating, comment }) =>
      axiosSecure.patch(`/reviews/${id}`, { rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries(["myReviews", reviewerName]);
      Swal.fire("Updated!", "Your review has been updated.", "success");
      setEditingReview(null);
    },
    onError: () => Swal.fire("Error", "Failed to update review.", "error"),
  });

  if (isLoading)
    return <div className="text-center py-20 text-xl">Loading reviews...</div>;

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f87171",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleUpdate = () => {
    if (!rating || !comment) {
      Swal.fire("Error", "Rating and comment cannot be empty", "error");
      return;
    }
    updateMutation.mutate({ id: editingReview._id, rating, comment });
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
              className="bg-white border rounded-2xl shadow-lg p-6 transition hover:shadow-2xl"
            >
                <h3 className="text-xl font-semibold text-orange-500 mb-2">
                Meal Name: {review.foodName}
              </h3>
              <h3 className="text-xl font-semibold text-orange-500 mb-2">
                Meal ID: {review.foodId}
              </h3>
              <p>
                <b>Rating:</b> {review.rating} ⭐
              </p>
              <p>
                <b>Comment:</b> {review.comment}
              </p>
              <p className="text-gray-500 text-sm">
                <b>Date:</b> {new Date(review.date).toLocaleString()}
              </p>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleEdit(review)}
                  className="flex-1 btn btn-warning text-white rounded-xl hover:bg-yellow-500"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="flex-1 btn btn-error text-white rounded-xl hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 relative shadow-lg">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">
              Edit Review
            </h3>

            <label className="block mb-2 font-semibold">Rating:</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <label className="block mb-2 font-semibold">Comment:</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingReview(null)}
                className="btn btn-gray rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="btn btn-success text-white rounded-xl"
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
