import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./AxiosSecure";
import { AuthContext } from "./AuthContext";
import MealDetailsModal from "./MealDetailsModal"; 
import { useNavigate } from "react-router";

const AllMeals = () => {
  const axiosPublic = useAxiosPublic();

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();


  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedMeal, setSelectedMeal] = useState(null);

  const { data: meals = [], isLoading } = useQuery({
    queryKey: ["meals", sortOrder],
    queryFn: async () => {
      const res = await axiosPublic.get(`/meals?sort=${sortOrder}`);
      return res.data;
    },
  });

  const handleSort = () => setSortOrder(sortOrder === "asc" ? "desc" : "asc");

  const handleViewDetails = (meal) => {
  if (!user) {
    navigate("/login");
    return;
  }
  setSelectedMeal(meal);
};


  if (isLoading) return <p className="text-center py-10">Loading meals...</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Meals</h1>
        <button onClick={handleSort} className="btn btn-outline btn-primary">
          Sort by Price: {sortOrder === "asc" ? "Low → High" : "High → Low"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {meals.map((meal) => (
          <div
            key={meal._id}
            className="card bg-base-100 border shadow-xl rounded-xl"
          >
            <figure>
              <img
                src={meal.foodImage}
                alt={meal.foodName}
                className="h-56 w-full object-cover"
              />
            </figure>

            <div className="card-body">
              <h2 className="card-title">{meal.foodName}</h2>
              <p><strong>Chef:</strong> {meal.chefName}</p>
              <p><strong>Chef Id:</strong> {meal._id}</p>
              <p><strong>Price:</strong> ${meal.price}</p>
              <p><strong>Rating:</strong> ⭐ {meal.rating}</p>

              <div className="card-actions justify-end mt-4">
                <button
                  onClick={() => handleViewDetails(meal)}
                  className="btn btn-primary"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          close={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
};

export default AllMeals;
