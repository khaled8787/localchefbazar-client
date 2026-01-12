import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import Swal from "sweetalert2";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const smoothX = useSpring(cursorX, { stiffness: 120, damping: 20 });
  const smoothY = useSpring(cursorY, { stiffness: 120, damping: 20 });

  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // Cursor tracking
  useEffect(() => {
    const moveCursor = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  useEffect(() => {
    cursorX.set(cursorPos.x - 15);
    cursorY.set(cursorPos.y - 15);
  }, [cursorPos, cursorX, cursorY]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    setTilt({ x: (y - midY) / midY, y: (x - midX) / midX });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Message Sent!",
      text: `Thank you ${formData.name}, we received your message.`,
      icon: "success",
      confirmButtonColor: "#F97316",
      confirmButtonText: "OK",
    });
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col lg:flex-row items-center justify-center px-6 lg:px-20 py-20 gap-16">
      
      {/* Floating Circles */}
      <motion.div
        className="absolute w-40 h-40 bg-orange-400/20 rounded-full top-10 left-10 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute w-60 h-60 bg-blue-400/20 rounded-full bottom-20 right-20 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, -30, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute w-32 h-32 bg-purple-400/20 rounded-full top-1/2 left-1/2 blur-3xl"
        animate={{ y: [-10, 10, -10], x: [10, -10, 10] }}
        transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Custom cursor */}
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="fixed w-8 h-8 bg-orange-400 rounded-full pointer-events-none mix-blend-difference shadow-lg z-50"
      />

      {/* Contact Info Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ x: -100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          rotateX: tilt.x * 10,
          rotateY: tilt.y * 10,
        }}
        whileHover={{ scale: 1.03 }}
        className="flex-1 text-white space-y-8 backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-gray-700 cursor-pointer"
      >
        <h2 className="text-5xl font-extrabold tracking-tight text-orange-400 drop-shadow-[0_0_25px_rgba(255,165,0,0.8)]">
          Get in Touch
        </h2>
        <p className="text-gray-300 text-lg">
          Have a question or want to work together? Fill out the form and we will reach out to you .
        </p>
        <div className="space-y-4 text-lg">
          <div className="flex items-center gap-4">
            <FaMapMarkerAlt className="text-orange-400 text-2xl" />
            <span>Natore, Bangladesh</span>
          </div>
          <div className="flex items-center gap-4">
            <FaPhone className="text-orange-400 text-2xl" />
            <span>+880 1737878716</span>
          </div>
          <div className="flex items-center gap-4">
            <FaEnvelope className="text-orange-400 text-2xl" />
            <span>mdkhaledmahmud01737@gmail.com</span>
          </div>
        </div>
      </motion.div>

      {/* Contact Form Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ x: 100, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          rotateX: tilt.x * 10,
          rotateY: tilt.y * 10,
        }}
        whileHover={{ scale: 1.03 }}
        className="flex-1 backdrop-blur-lg bg-gray-900/80 p-8 rounded-3xl shadow-2xl border border-gray-700 w-full max-w-lg cursor-pointer"
      >
        <h3 className="text-3xl font-bold text-orange-400 mb-6 text-center">
          Send a Message
        </h3>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
          />

          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-orange-400 text-gray-900 font-bold rounded-xl shadow-lg hover:shadow-2xl transition-all text-lg"
          >
            Send Message
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
};

export default ContactPage;
