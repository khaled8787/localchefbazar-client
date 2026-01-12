import { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import UpdateMealModal from "./UpdateMealModal";
import Swal from "sweetalert2";
import { AuthContext } from "../AuthContext";
import useAxiosPublic from "../AxiosSecure";

const MyMeals = () => {
  const { user } = useContext(AuthContext);
  const axios = useAxiosPublic();
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { data: meals = [], refetch, isLoading } = useQuery({
    queryKey: ["myMeals", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/meals/by-chef/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this meal?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      const res = await axios.delete(`/meals/${id}`);
      if (res.data.deletedCount) {
        Swal.fire("Deleted!", "Meal removed successfully", "success");
        refetch();
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-orange-600 mb-8">
        My Meals
      </h1>

      {meals.length === 0 ? (
        <p className="text-center text-gray-500 mt-20">
          You haven't created any meals yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal) => (
            <div
              key={meal._id}
              className="relative bg-white rounded-3xl shadow-xl border border-orange-100 overflow-hidden hover:scale-[1.02] transition-all duration-300"
            >
              {/* Glow Effect */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-3xl"></div>

              <figure className="h-48 overflow-hidden">
                <img
                  src={meal.foodImage}
                  alt={meal.foodName}
                  className="w-full h-full object-cover rounded-t-3xl"
                />
              </figure>

              <div className="p-5 space-y-2">
                <h2 className="text-xl font-bold text-gray-800">{meal.foodName}</h2>
                <p className="text-gray-600"><b>Price:</b> ${meal.price}</p>
                <p className="text-gray-600"><b>Rating:</b> ⭐ {meal.rating}</p>
                <p className="text-gray-600"><b>Ingredients:</b> {meal.ingredients.join(", ")}</p>
                <p className="text-gray-600"><b>Delivery Time:</b> {meal.estimatedDeliveryTime}</p>
                <p className="text-gray-600"><b>Chef:</b> {meal.chefName}</p>
                <p className="text-gray-600"><b>Chef ID:</b> {meal._id}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleDelete(meal._id)}
                    className="btn btn-error btn-sm text-white bg-red-500 hover:bg-red-600 rounded-xl flex-1 mr-2"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => setSelectedMeal(meal)}
                    className="btn btn-info btn-sm text-white bg-blue-500 hover:bg-blue-600 rounded-xl flex-1 ml-2"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMeal && (
        <UpdateMealModal
          meal={selectedMeal}
          close={() => setSelectedMeal(null)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default MyMeals;
