import { motion } from "framer-motion";
import { Star } from "react-feather";
import { Swiper, SwiperSlide } from "swiper/react";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "./AxiosSecure";
import "swiper/css";

const ChefsSection = () => {
  const axiosPublic = useAxiosPublic();

  const { data: chefs = [], isLoading } = useQuery({
    queryKey: ["home-chefs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/users?role=chef");
      return res.data.slice(0, 6); // শুধু 6 জন chef
    },
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">
        Loading chefs...
      </div>
    );
  }

  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">

      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.18),transparent_60%)]"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.9)]"
      >
        🍽️ Explore Our <span className="text-white">Top Chefs</span>
      </motion.h2>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-10 px-10 max-w-7xl mx-auto relative">
        {chefs.map((chef) => (
          <motion.div
            key={chef._id}
            whileHover={{ scale: 1.06, rotateX: 6, rotateY: -6 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gray-900 rounded-3xl p-5 border border-gray-700 shadow-[0_25px_70px_rgba(0,0,0,0.85)] hover:shadow-orange-500/30"
          >
            <img
              src={chef.photo}
              alt={chef.name}
              className="w-full h-60 object-cover rounded-2xl"
            />

            <h3 className="text-xl font-semibold mt-4 text-gray-200">
              {chef.name}
            </h3>

            <p className="text-sm text-gray-400">
              {chef.specialty || "Professional Home Chef"}
            </p>

            <div className="flex items-center gap-2 mt-2 text-orange-400">
              <Star size={18} className="fill-orange-400" />
              <span className="font-semibold">
                {chef.rating || "4.8"}
              </span>
            </div>

            <p className="text-gray-500 mt-1 text-sm">
              Experience: {chef.experience || "5"} years
            </p>

            <button className="mt-4 w-full py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition">
              View Meals
            </button>
          </motion.div>
        ))}
      </div>

      {/* Mobile Swiper */}
      <div className="md:hidden px-6 relative">
        <Swiper spaceBetween={20} slidesPerView={1.2}>
          {chefs.map((chef) => (
            <SwiperSlide key={chef._id}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="bg-gray-900 rounded-3xl p-5 border border-gray-700 shadow-xl"
              >
                <img
                  src={chef.photo}
                  alt={chef.name}
                  className="w-full h-52 object-cover rounded-2xl"
                />

                <h3 className="text-xl font-semibold mt-4 text-gray-200">
                  {chef.name}
                </h3>

                <p className="text-sm text-gray-400">
                  {chef.specialty || "Professional Home Chef"}
                </p>

                <div className="flex items-center gap-2 mt-2 text-orange-400">
                  <Star size={18} className="fill-orange-400" />
                  <span className="font-semibold">
                    {chef.rating || "4.8"}
                  </span>
                </div>

                <p className="text-gray-500 mt-1 text-sm">
                  Experience: {chef.experience || "5"} years
                </p>

                <button className="mt-4 w-full py-2 rounded-xl bg-orange-600 text-white font-semibold hover:bg-orange-700 transition">
                  View Meals
                </button>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ChefsSection;
