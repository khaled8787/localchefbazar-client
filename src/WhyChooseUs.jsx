import { motion } from "framer-motion";
import { GiShoppingBag, GiCook, GiMeal, GiDeliveryDrone } from "react-icons/gi";

const reasons = [
  {
    id: 1,
    title: "Fresh Ingredients",
    desc: "We use only fresh and locally sourced ingredients to ensure top quality meals.",
    icon: <GiShoppingBag size={36} className="text-orange-500" />,
  },
  {
    id: 2,
    title: "Expert Chefs",
    desc: "Our chefs are experienced professionals passionate about cooking delicious meals.",
    icon: <GiCook size={36} className="text-orange-500" />,
  },
  {
    id: 3,
    title: "Variety of Meals",
    desc: "From traditional dishes to international cuisine, we offer a wide variety of options.",
    icon: <GiMeal size={36} className="text-orange-500" />,
  },
  {
    id: 4,
    title: "Fast Delivery",
    desc: "Your meals are delivered fresh and hot right to your doorstep in record time.",
    icon: <GiDeliveryDrone size={36} className="text-orange-500" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.9)]"
      >
        Why <span className="text-white">Choose Us</span>
      </motion.h2>

      {/* Reasons Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 px-6 md:px-12 max-w-7xl mx-auto">
        {reasons.map((reason) => (
          <motion.div
            key={reason.id}
            whileHover={{ scale: 1.06, y: -5 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gray-900 rounded-3xl p-8 border border-gray-700 shadow-[0_25px_70px_rgba(0,0,0,0.85)] hover:shadow-orange-500/40 relative overflow-hidden"
          >
            <div className="mb-6 flex justify-center">
              {reason.icon}
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">
              {reason.title}
            </h3>
            <p className="text-gray-300 text-center text-sm">{reason.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
