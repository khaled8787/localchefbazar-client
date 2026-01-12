import React, { useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";
import { FaHeartBroken, FaTrash } from "react-icons/fa";

const FavoriteMealsPage = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosPublic();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["favorites", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/favorites/user/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axiosSecure.delete(`/favorites/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites", user?.email]);
      Swal.fire("Removed!", "Meal removed from favorites.", "success");
    },
    onError: () => {
      Swal.fire("Error", "Failed to remove meal.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Remove from favorites?",
      text: "You can add it again anytime.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-10">
      <div className="max-w-6xl mx-auto bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-orange-100 p-6 md:p-10 relative overflow-hidden">

        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <div className="p-4 bg-orange-500 text-white rounded-2xl shadow-lg">
            <FaHeartBroken size={22} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              My Favorite Meals
            </h2>
            <p className="text-sm text-gray-500">
              Meals you love and saved for later
            </p>
          </div>
        </div>

        {/* Empty state */}
        {favorites.length === 0 ? (
          <div className="relative z-10 text-center py-20">
            <FaHeartBroken className="mx-auto text-6xl text-orange-400 mb-4" />
            <p className="text-gray-500 text-lg">
              You have no favorite meals yet.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block relative z-10 overflow-x-auto">
              <table className="min-w-full rounded-2xl shadow-lg overflow-hidden">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <tr>
                    <th className="py-4 px-6 text-left">Meal</th>
                    <th className="py-4 px-6 text-left">Chef</th>
                    <th className="py-4 px-6 text-left">Price</th>
                    <th className="py-4 px-6 text-left">Added On</th>
                    <th className="py-4 px-6 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="text-black">
                  {favorites.map((fav) => (
                    <tr
                      key={fav._id}
                      className="border-b hover:bg-orange-50 transition"
                    >
                      <td className="py-4 px-6 font-medium">
                        {fav.mealName}
                      </td>
                      <td className="py-4 px-6">{fav.chefName}</td>
                      <td className="py-4 px-6">
                        {fav.price ? `$${fav.price}` : "-"}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {new Date(fav.addedTime).toLocaleDateString()} <br />
                        {new Date(fav.addedTime).toLocaleTimeString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleDelete(fav._id)}
                          className="btn btn-error btn-sm rounded-xl flex items-center gap-2"
                        >
                          <FaTrash /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden relative z-10 grid gap-4">
              {favorites.map((fav) => (
                <div
                  key={fav._id}
                  className=" rounded-2xl shadow-lg p-5 border border-orange-100"
                >
                  <h3 className="text-lg text-black font-bold ">
                    {fav.mealName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Chef: {fav.chefName}
                  </p>
                  <p className="text-sm mt-1">
                    Price:{" "}
                    <span className="font-semibold text-orange-600">
                      {fav.price ? `$${fav.price}` : "-"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Added: {new Date(fav.addedTime).toLocaleString()}
                  </p>

                  <button
                    onClick={() => handleDelete(fav._id)}
                    className="mt-4 w-full btn btn-error rounded-xl flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FavoriteMealsPage;
