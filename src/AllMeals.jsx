import { useState, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Star } from "react-feather";
import useAxiosPublic from "./AxiosSecure";
import { AuthContext } from "./AuthContext";
import MealDetailsModal from "./MealDetailsModal";
import { useNavigate } from "react-router";

const SkeletonCard = () => {
  return (
    <div className="bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden animate-pulse">
      <div className="h-52 bg-gray-700"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-10 bg-gray-700 rounded mt-4"></div>
      </div>
    </div>
  );
};

const AllMeals = () => {
  const axiosPublic = useAxiosPublic();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["meals", sortOrder, page, search],
    queryFn: async () => {
      const res = await axiosPublic.get(
        `/meals?sort=${sortOrder}&page=${page}&search=${search}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const meals = data?.meals || [];
  const totalPages = data?.totalPages || 1;

  const handleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setPage(1);
  };

  const handleViewDetails = (meal) => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSelectedMeal(meal);
  };

  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.18),transparent_60%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-14">
          <h1 className="text-4xl font-extrabold text-orange-400 drop-shadow-[0_0_20px_rgba(255,165,0,0.8)]">
            🍽️ All Meals
          </h1>

          <input
            type="text"
            placeholder="Search meals..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input input-bordered bg-gray-900 border-gray-700 text-gray-200 w-full md:w-64"
          />

          <button
            onClick={handleSort}
            className="px-5 py-2 rounded-xl border border-orange-500 text-orange-400 hover:bg-orange-600 hover:text-white transition"
          >
            Sort: {sortOrder === "asc" ? "Low → High" : "High → Low"}
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            : meals.map((meal) => (
                <motion.div
                  key={meal._id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 160 }}
                  className="bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.85)] hover:shadow-orange-500/30 flex flex-col"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={meal.foodImage}
                      alt={meal.foodName}
                      className="w-full h-52 object-cover hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-5 text-gray-200 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold">{meal.foodName}</h3>

                    <p className="text-sm text-gray-400 mt-1">
                      👨‍🍳 {meal.chefName}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <Star size={16} className="text-orange-400 fill-orange-400" />
                      <span className="font-semibold">{meal.rating}</span>
                    </div>

                    <p className="text-xl font-bold mt-3 text-orange-400">
                      ${meal.price}
                    </p>

                    <button
                      onClick={() => handleViewDetails(meal)}
                      className="mt-auto w-full py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 mt-16">
          <button
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span className="text-gray-300 font-semibold">
            Page {page} of {totalPages}
          </span>

          <button
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 disabled:opacity-40"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {selectedMeal && (
        <MealDetailsModal
          meal={selectedMeal}
          close={() => setSelectedMeal(null)}
        />
      )}
    </section>
  );
};

export default AllMeals;
