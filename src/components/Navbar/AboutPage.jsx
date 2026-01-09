import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";

// Particle component with floating + rotation + parallax effect
const Particle = ({ size, x, y, delay, mouseX, mouseY, scrollY }) => {
  const parallaxX = useTransform(mouseX, [-window.innerWidth / 2, window.innerWidth / 2], [-20, 20]);
  const parallaxY = useTransform(mouseY, [-window.innerHeight / 2, window.innerHeight / 2], [-20, 20]);
  const floatY = useTransform(scrollY, [0, 500], [0, 30]); // scroll-based subtle float

  return (
    <motion.div
      initial={{ opacity: 0, x, y, scale: 0 }}
      animate={{
        opacity: 0.4,
        scale: 1,
        x: x + parallaxX,
        y: y + parallaxY + floatY,
        rotate: [0, 10, -10, 0],
      }}
      transition={{ repeat: Infinity, repeatType: "reverse", duration: 6, delay }}
      className={`absolute rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(255,255,0,0.9)]`}
      style={{ width: size, height: size }}
    />
  );
};

const AboutPage = () => {
  const [team, setTeam] = useState([]);
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const scrollY = useMotionValue(0);

  useEffect(() => {
    // Mouse move tracking
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - window.innerWidth / 2);
      mouseY.set(e.clientY - window.innerHeight / 2);
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Scroll tracking
    const handleScroll = () => scrollY.set(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    // Fetch all users and filter chefs (max 6)
    fetch(`${import.meta.env.VITE_SERVER_URL}/users`)
      .then((res) => res.json())
      .then((data) => {
        const chefs = data.filter((u) => u.role === "chef").slice(0, 6);
        setTeam(chefs);
      })
      .catch((err) => console.log(err));

    // Fetch stats dynamically
    Promise.all([
      fetch(`${import.meta.env.VITE_SERVER_URL}/meals`).then((res) => res.json()),
      fetch(`${import.meta.env.VITE_SERVER_URL}/users`).then((res) => res.json()),
      fetch(`${import.meta.env.VITE_SERVER_URL}/orders`).then((res) => res.json()),
    ])
      .then(([meals, users, orders]) => {
        setStats([
          { label: "Meals Served", value: meals.length },
          { label: "Active Chefs", value: users.filter((u) => u.role === "chef").length },
          { label: "Orders Completed", value: orders.length },
        ]);
      })
      .catch((err) => console.log(err));

    // Fetch testimonials (max 6)
    fetch(`${import.meta.env.VITE_SERVER_URL}/reviews`)
      .then((res) => res.json())
      .then((data) => setTestimonials(data.slice(0, 6)))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative text-center py-32 px-4 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 rounded-b-3xl shadow-2xl overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <Particle
            key={i}
            size={`${6 + i * 3}px`}
            x={Math.random() * 600 - 300}
            y={Math.random() * 200 - 100}
            delay={i * 0.3}
            mouseX={mouseX}
            mouseY={mouseY}
            scrollY={scrollY}
          />
        ))}

        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold mb-4 text-yellow-400 drop-shadow-[0_0_25px_rgba(255,255,0,0.95)]"
        >
          About LocalChefBazaar
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-3xl mx-auto text-lg text-gray-300 drop-shadow-md"
        >
          Connecting food lovers with local chefs. Fresh, homemade meals delivered directly to your doorstep. Experience quality, variety, and passion in every meal.
        </motion.p>
      </section>


      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Our Mission & Vision</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🍳</div>
            <h3 className="text-xl font-semibold mb-2">Fresh Meals</h3>
            <p>Delivering freshly cooked meals made with love by local chefs.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold mb-2">Support Local</h3>
            <p>Empowering local chefs and small businesses in your community.</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 text-center">
            <div className="text-4xl mb-4">💛</div>
            <h3 className="text-xl font-semibold mb-2">Customer Happiness</h3>
            <p>Ensuring every customer enjoys delicious meals every time.</p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">Our Chefs</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gray-800 rounded-3xl shadow-2xl p-8 text-center border border-gray-700"
            >
              <img
                src={member.photo || "https://i.ibb.co/default-profile.png"}
                alt={member.name}
                className="w-32 h-32 mx-auto rounded-full mb-4 object-cover border-4 border-yellow-400 shadow-lg"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">Testimonials</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800 rounded-3xl shadow-2xl p-6 flex gap-4 items-center border border-gray-700"
            >
              <img
                src={t.
reviewerImage || "https://i.ibb.co/default-profile.png"}
                alt={t.reviewerName || t.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400"
              />
              <div>
                <p className="italic text-gray-300">"{t.comment}"</p>
                <h4 className="font-semibold mt-2">{t.reviewerName || t.name}</h4>
                
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      
    </div>
  );
};

export default AboutPage;
