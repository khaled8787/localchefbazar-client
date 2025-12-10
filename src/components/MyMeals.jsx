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

  // 🔥 My meals fetch
  const { data: meals = [], refetch } = useQuery({
  queryKey: ["myMeals", user?.email],
  queryFn: async () => {
    console.log("Fetching meals for:", user?.email);
    const res = await axios.get(`/meals/by-chef/${user?.email}`);
    console.log("Response from server:", res.data);
    return res.data;
  },
  enabled: !!user?.email,
});


  // ❌ Delete Meal
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this meal?",
      icon: "warning",
      showCancelButton: true,
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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Meals</h1>

      {/* Grid layout */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {meals.map((meal) => (
          <div
            key={meal._id}
            className="card bg-base-100 shadow-xl p-4 border rounded-xl"
          >
            <figure className="h-48">
              <img
                src={meal.foodImage}
                alt="Meal"
                className="w-full h-full object-cover rounded-lg"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{meal.foodName}</h2>

              <p><b>Price:</b> ${meal.price}</p>
              <p><b>Rating:</b> ⭐ {meal.rating}</p>
              <p><b>Ingredients:</b> {meal.ingredients}</p>
              <p><b>Delivery Time:</b> {meal.estimatedDeliveryTime}</p>
              <p><b>Chef:</b> {meal.chefName}</p>
              <p><b>Chef ID:</b> {meal._id}</p>

              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => handleDelete(meal._id)}
                  className="btn btn-error btn-sm text-white"
                >
                  Delete
                </button>

                <button
                  onClick={() => setSelectedMeal(meal)}
                  className="btn btn-info btn-sm text-white"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Update Modal */}
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
