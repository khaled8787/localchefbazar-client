import { motion } from "framer-motion";
import { Star } from "react-feather";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const chefsData = [
  {
    id: 1,
    name: "Chef Ayesha",
    expertise: "Italian Cuisine",
    rating: 4.8,
    experience: 5,
    image: "https://media.istockphoto.com/id/1481454325/photo/portrait-of-indian-women-chef-standing-isolated-over-gray-background.jpg?b=1&s=612x612&w=0&k=20&c=z8d7UpyQzYZ7lrDz3pRHiF9gpj4VRKyts8JYnKWorAA=",
  },
  {
    id: 2,
    name: "Chef Rahim",
    expertise: "Bangladeshi Cuisine",
    rating: 4.9,
    experience: 7,
    image: "https://images.pexels.com/photos/29488811/pexels-photo-29488811.jpeg",
  },
  {
    id: 3,
    name: "Chef Sumi",
    expertise: "Desserts & Bakery",
    rating: 4.7,
    experience: 4,
    image: "https://media.istockphoto.com/id/1157398335/photo/latin-chef-smiling-pointing-at-the-left-side-of-her-filipina-on-pink-background.jpg?b=1&s=612x612&w=0&k=20&c=HtsRnoofcuET3-kq33gxRKkaHKHEoMCEW_LgC24o4RQ=",
  },
  {
    id: 4,
    name: "Chef Tanvir",
    expertise: "Fast Food",
    rating: 4.6,
    experience: 6,
    image: "https://images.pexels.com/photos/9986235/pexels-photo-9986235.jpeg",
  },
  {
    id: 5,
    name: "Chef Nabila",
    expertise: "Healthy Meals",
    rating: 4.8,
    experience: 5,
    image: "https://media.istockphoto.com/id/1486376269/photo/portrait-of-happy-indian-housewife-in-kitchen-holding-kitchen-cooking-accessories.jpg?b=1&s=612x612&w=0&k=20&c=AQDndnENoTeKpVhlE3o4Hp7I-rsewFSMfij6gHLgL0Y=",
  },
  {
    id: 6,
    name: "Chef Arif",
    expertise: "Seafood Specialties",
    rating: 4.7,
    experience: 8,
    image: "https://images.pexels.com/photos/4253292/pexels-photo-4253292.jpeg",
  },
];

const ChefsSection = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-white to-orange-50">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold text-center mb-10"
      >
        🍽️ Explore Our <span className="text-orange-600">Top Chefs</span>
      </motion.h2>

      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
        {chefsData.map((chef) => (
          <motion.div
            key={chef.id}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white shadow-xl rounded-2xl p-5 border border-orange-100 hover:shadow-2xl"
          >
            <img
              src={chef.image}
              className="w-full h-60 object-cover rounded-xl"
              alt={chef.name}
            />
            <h3 className="text-xl font-semibold mt-4">{chef.name}</h3>
            <p className="text-sm text-gray-600">{chef.expertise}</p>

            <div className="flex items-center gap-1 text-orange-500 mt-2">
              <Star size={18} />
              <span className="font-semibold">{chef.rating}</span>
            </div>

            <p className="text-gray-500 mt-1 text-sm">
              Experience: {chef.experience} years
            </p>

            <button className="btn btn-sm bg-orange-600 text-white w-full mt-4 hover:bg-orange-700">
              View Meals
            </button>
          </motion.div>
        ))}
      </div>

      <div className="md:hidden px-6">
        <Swiper spaceBetween={20} slidesPerView={1.2}>
          {chefsData.map((chef) => (
            <SwiperSlide key={chef.id}>
              <motion.div
                whileHover={{ scale: 1.04 }}
                className="bg-white shadow-xl rounded-2xl p-5 border border-orange-100"
              >
                <img
                  src={chef.image}
                  className="w-full h-52 object-cover rounded-xl"
                  alt={chef.name}
                />
                <h3 className="text-xl font-semibold mt-4">{chef.name}</h3>
                <p className="text-sm text-gray-600">{chef.expertise}</p>

                <div className="flex items-center gap-1 text-orange-500 mt-2">
                  <Star size={18} />
                  <span className="font-semibold">{chef.rating}</span>
                </div>

                <p className="text-gray-500 mt-1 text-sm">
                  Experience: {chef.experience} years
                </p>

                <button className="btn btn-sm bg-orange-600 text-white w-full mt-4 hover:bg-orange-700">
                  View Meals
                </button>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ChefsSection;
