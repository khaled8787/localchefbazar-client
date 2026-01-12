import { motion } from "framer-motion";
import { Star } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./AxiosSecure";

const DailyMealsSection = () => {
  const axiosPublic = useAxiosPublic();

  const { data: meals = [], isLoading, error } = useQuery({
    queryKey: ["daily-meals"],
    queryFn: async () => {
      const res = await axiosPublic.get("/meals");
      return res.data.meals || [];
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-300">
        Loading daily meals...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load meals. Please try again.
      </div>
    );

  const latestMeals = [...meals]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.15),transparent_60%)]"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.8)]"
      >
        🍽️ Today’s <span className="text-white">Daily Meals</span>
      </motion.h2>

      {/* Cards */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-10 max-w-7xl mx-auto">
        {latestMeals.map((meal) => (
          <motion.div
            key={meal._id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 160 }}
            className="group bg-gray-900 rounded-3xl border border-gray-700 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)] hover:shadow-orange-500/30 h-full flex flex-col"
          >
            {/* Image */}
            <div className="relative overflow-hidden">
              <img
                src={meal.foodImage}
                alt={meal.foodName}
                className="w-full h-52 object-cover group-hover:scale-110 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow text-gray-200">
              <h3 className="text-lg font-bold">{meal.foodName}</h3>

              <p className="text-sm text-gray-400 mt-1">
                👨‍🍳 {meal.chefExperience} experience
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Star size={16} className="text-orange-400 fill-orange-400" />
                <span className="font-semibold">{meal.rating}</span>
              </div>

              <p className="text-xl font-bold mt-3 text-orange-400">
                ${meal.price}
              </p>

              {/* Button */}
              <button className="mt-auto w-full py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition">
                View Details
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default DailyMealsSection;
