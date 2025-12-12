import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

const FavoriteMealsPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();
  const queryClient = useQueryClient();

  // Fetch favorite meals
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/favorites/user/${user?.email}`);
      return res.data;
    },
  });

  // Delete favorite meal
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/favorites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites", user?.email]);
      Swal.fire("Removed!", "Meal removed from favorites successfully.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to remove meal.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This meal will be removed from your favorites.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f87171",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading)
    return <div className="text-center py-20 text-xl">Loading favorite meals...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-bold text-orange-600 text-center mb-10">
        My Favorite Meals
      </h2>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">You have no favorite meals yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-xl shadow-lg">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="py-3 px-6 text-left">Meal Name</th>
                <th className="py-3 px-6 text-left">Chef Name</th>
                <th className="py-3 px-6 text-left">Price</th>
                <th className="py-3 px-6 text-left">Date Added</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((fav) => (
                <tr
                  key={fav._id}
                  className="border-b hover:bg-orange-50 transition"
                >
                  <td className="py-4 px-6">{fav.mealName}</td>
                  <td className="py-4 px-6">{fav.chefName}</td>
                  <td className="py-4 px-6">{fav.price ? `$${fav.price}` : "-"}</td>
                  <td className="py-4 px-6">
                    {new Date(fav.addedTime).toLocaleDateString()}{" "}
                    {new Date(fav.addedTime).toLocaleTimeString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => handleDelete(fav._id)}
                      className="btn btn-error text-white bg-red-500 hover:bg-red-600 rounded-xl px-4 py-2"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FavoriteMealsPage;
