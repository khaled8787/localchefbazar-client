import { motion } from "framer-motion";
import { Star } from "react-feather";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./AxiosSecure"; 

const DailyMealsSection = () => {
  const axiosPublic = useAxiosPublic(); 

  const { data: meals = [], isLoading, error } = useQuery({
    queryKey: ["daily-meals"],
    queryFn: async () => {
      const res = await axiosPublic.get("/meals?limit=6"); 
      return res.data;
    },
  });

  if (isLoading)
    return <div className="text-center py-10">Loading daily meals...</div>;

  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load meals. Please try again.
      </div>
    );

  return (
    <section className="py-20 bg-gray-50">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-12"
      >
        🍽️ Today's <span className="text-orange-600">Daily Meals</span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-10">
        {meals.map((meal) => (
          <motion.div
            key={meal._id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-2xl"
          >
            <img
              src={meal.image}
              alt={meal.name}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h3 className="text-xl font-semibold">{meal.name}</h3>
              <p className="text-gray-500 mt-1">{meal.description}</p>

              <div className="flex items-center gap-2 mt-2">
                <Star size={18} className="text-orange-500" />
                <span className="font-semibold">{meal.rating}</span>
              </div>

              <p className="text-gray-700 font-semibold mt-2">
                Price: ${meal.price}
              </p>

              <button className="btn btn-sm bg-orange-600 text-white w-full mt-4 hover:bg-orange-700">
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
