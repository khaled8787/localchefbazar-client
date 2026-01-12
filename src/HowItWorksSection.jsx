import { motion } from "framer-motion";
import { GiShoppingBag, GiCook, GiMeal, GiDeliveryDrone } from "react-icons/gi";
import { Swiper, SwiperSlide } from "swiper/react"; // ✅ এখানে
import "swiper/css"; 

const steps = [
  {
    id: 1,
    icon: <GiShoppingBag size={40} />,
    title: "Browse Meals",
    desc: "Explore a wide variety of home-cooked meals from talented local chefs."
  },
  {
    id: 2,
    icon: <GiCook size={40} />,
    title: "Choose Your Chef",
    desc: "Select your preferred chef based on cuisine, ratings, and experience."
  },
  {
    id: 3,
    icon: <GiMeal size={40} />,
    title: "Place Your Order",
    desc: "Easily place your order with just a few clicks and track it in real-time."
  },
  {
    id: 4,
    icon: <GiDeliveryDrone size={40} />,
    title: "Enjoy Your Meal",
    desc: "Receive fresh homemade meals at your doorstep and enjoy quality food."
  },
];

const HowItWorksSection = () => {
  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">

      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.12),transparent_70%)]"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.9)]"
      >
        ⚡ How It <span className="text-white">Works</span>
      </motion.h2>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-10 px-10 max-w-7xl mx-auto relative">
        {steps.map((step) => (
          <motion.div
            key={step.id}
            whileHover={{ scale: 1.06, rotateX: 6, rotateY: -6 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gray-900 rounded-3xl p-6 border border-gray-700 shadow-[0_25px_70px_rgba(0,0,0,0.85)] hover:shadow-orange-500/30 text-center"
          >
            <div className="flex justify-center mb-4 text-orange-400">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mt-2 text-gray-200">{step.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Mobile Swiper */}
      <div className="md:hidden px-6 relative">
        <Swiper spaceBetween={20} slidesPerView={1.2}>
          {steps.map((step) => (
            <SwiperSlide key={step.id}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 180 }}
                className="bg-gray-900 rounded-3xl p-6 border border-gray-700 shadow-xl text-center"
              >
                <div className="flex justify-center mb-4 text-orange-400">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mt-2 text-gray-200">{step.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{step.desc}</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default HowItWorksSection;
