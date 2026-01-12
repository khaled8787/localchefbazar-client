import { motion } from "framer-motion";
import { FaLightbulb, FaLeaf, FaFireAlt, FaClock } from "react-icons/fa";

const tips = [
  {
    id: 1,
    title: "Fresh Ingredients ব্যবহার করো",
    desc: "সবসময় টাটকা উপকরণ ব্যবহার করলে খাবারের স্বাদ ও পুষ্টিগুণ দুটোই বজায় থাকে।",
    icon: <FaLeaf />,
  },
  {
    id: 2,
    title: "সঠিক তাপমাত্রায় রান্না",
    desc: "খুব বেশি বা কম তাপে রান্না করলে খাবারের স্বাদ নষ্ট হতে পারে। মাঝারি তাপ সবচেয়ে ভালো।",
    icon: <FaFireAlt />,
  },
  {
    id: 3,
    title: "সময় ব্যবস্থাপনা গুরুত্বপূর্ণ",
    desc: "রান্নার আগে সব উপকরণ প্রস্তুত করে নিলে খাবার দ্রুত ও সুন্দরভাবে তৈরি হয়।",
    icon: <FaClock />,
  },
  {
    id: 4,
    title: "স্বাস্থ্যকর বিকল্প বেছে নাও",
    desc: "অতিরিক্ত তেল ও লবণ এড়িয়ে স্বাস্থ্যকর খাবার বেছে নাও প্রতিদিন।",
    icon: <FaLightbulb />,
  },
];

const TipsSection = () => {
  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white overflow-hidden">

      {/* Glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,165,0,0.15),transparent_60%)]"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.9)]"
      >
        💡 Smart <span className="text-white">Food Tips</span>
      </motion.h2>

      {/* Tips Cards */}
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {tips.map((tip) => (
          <motion.div
            key={tip.id}
            whileHover={{ scale: 1.06, rotateX: 6, rotateY: -6 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-[0_25px_70px_rgba(0,0,0,0.85)] hover:shadow-orange-500/30 text-center"
          >
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-5 flex items-center justify-center rounded-2xl bg-orange-600/20 text-orange-400 text-3xl shadow-[0_0_30px_rgba(255,165,0,0.6)]">
              {tip.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-semibold text-gray-200">
              {tip.title}
            </h3>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              {tip.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TipsSection;
