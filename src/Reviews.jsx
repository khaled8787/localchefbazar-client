import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Star } from "react-feather";
import useAxiosPublic from "./AxiosSecure";

const HomeReviewsSection = () => {
  const axiosPublic = useAxiosPublic();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["home-reviews"],
    queryFn: async () => {
      const res = await axiosPublic.get("/home-reviews");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="text-center py-20 text-gray-300">
        Loading reviews...
      </div>
    );

  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">

      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.15),transparent_60%)]"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.8)]"
      >
        ⭐ Customer <span className="text-white">Reviews</span>
      </motion.h2>

      {/* Reviews Grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6 md:px-12 max-w-7xl mx-auto">
        {reviews.slice(0, 6).map((rev) => (
          <motion.div
            key={rev._id}
            whileHover={{ scale: 1.06, rotateX: 6, rotateY: -6 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gray-900 rounded-3xl p-6 border border-gray-700 shadow-[0_25px_70px_rgba(0,0,0,0.85)] hover:shadow-orange-500/30"
          >
            {/* User Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={rev.reviewerImage}
                alt={rev.reviewerName}
                className="w-14 h-14 rounded-full object-cover border-2 border-orange-400 shadow-lg"
              />
              <div>
                <p className="font-semibold text-gray-200">
                  {rev.reviewerName}
                </p>
                <p className="text-sm text-gray-400">
                  {rev.reviewerEmail}
                </p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <Star size={18} className="text-orange-400 fill-orange-400" />
              <span className="font-semibold text-gray-200">
                {rev.rating}
              </span>
            </div>

            {/* Comment */}
            <p className="text-gray-300 leading-relaxed">
              “{rev.comment}”
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HomeReviewsSection;
