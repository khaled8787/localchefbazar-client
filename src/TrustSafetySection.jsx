import { motion } from "framer-motion";
import {
  FaUserShield,
  FaShieldAlt,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

const trustItems = [
  {
    id: 1,
    title: "Verified Home Chefs",
    desc: "Every chef is manually verified to ensure food quality, hygiene, and authenticity.",
    icon: <FaUserShield size={34} />,
  },
  {
    id: 2,
    title: "Secure Payments",
    desc: "All payments are protected with encrypted and trusted payment gateways.",
    icon: <FaLock size={34} />,
  },
  {
    id: 3,
    title: "Quality Assurance",
    desc: "We maintain strict quality checks and customer review monitoring.",
    icon: <FaCheckCircle size={34} />,
  },
  {
    id: 4,
    title: "Privacy Protection",
    desc: "Your personal data is safe with us and never shared without permission.",
    icon: <FaShieldAlt size={34} />,
  },
];

const TrustSafetySection = () => {
  return (
    <section className="relative py-28 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.15),transparent_65%)]"></div>

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative text-4xl md:text-5xl font-extrabold text-center mb-16 text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.8)]"
      >
        🔒 Trust & <span className="text-white">Safety</span>
      </motion.h2>

      {/* Cards */}
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {trustItems.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.08, rotateX: 6, rotateY: -6 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="bg-gray-900 p-8 rounded-3xl border border-gray-700 shadow-[0_25px_70px_rgba(0,0,0,0.85)] hover:shadow-orange-500/30 text-center"
          >
            <div className="flex justify-center text-orange-400 mb-5">
              {item.icon}
            </div>

            <h3 className="text-xl font-semibold text-gray-200 mb-2">
              {item.title}
            </h3>

            <p className="text-sm text-gray-400 leading-relaxed">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrustSafetySection;
