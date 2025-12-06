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
    return <div className="text-center py-10">Loading reviews...</div>;

  return (
    <section className="py-20 bg-white">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-12"
      >
        ⭐ Customer <span className="text-orange-600">Reviews</span>
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6 md:px-12">
        {reviews.map((rev) => (
          <motion.div
            key={rev._id}
            whileHover={{ scale: 1.05 }}
            className="p-6 shadow-xl bg-gray-50 border border-orange-100 rounded-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <img
                src={rev.reviewerImage}
                className="w-12 h-12 object-cover rounded-full"
              />
              <div>
                <p className="font-semibold">{rev.reviewerName}</p>
                <p className="text-sm text-gray-500">{rev.reviewerEmail}</p>
              </div>
            </div>

            <p className="flex items-center gap-2 font-semibold">
              <Star size={18} className="text-orange-500" /> {rev.rating}
            </p>

            <p className="mt-3 text-gray-700">{rev.comment}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HomeReviewsSection;
