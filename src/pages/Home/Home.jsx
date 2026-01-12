import React from "react";
import { motion } from "framer-motion";
import ChefsSection from "../../chefSection";
import DailyMealsSection from "../../DailyMealsSection";
import HomeReviewsSection from "../../Reviews";
import CategoriesSection from "../../CategoriesSection";
import HowItWorksSection from "../../HowItWorksSection";
import WhyChooseUs from "../../WhyChooseUs";
import FAQSection from "../../FAQSection";
import TipsSection from "../../TipsSection";
import TrustSafetySection from "../../TrustSafetySection";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white overflow-hidden">

      {/* HERO AREA */}
      <div className="min-h-[65vh] px-6 flex items-center">
        <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-14">

          {/* LEFT CONTENT */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >
            <h1 className="text-4xl lg:text-6xl font-extrabold leading-tight drop-shadow-xl">
              Fresh, Homemade Meals  
              <span className="block text-yellow-400 glow-text">
                Delivered to You
              </span>
            </h1>

            <p className="mt-6 text-gray-300 text-lg max-w-xl">
              Discover premium home-cooked meals prepared by verified local chefs.  
              Hygienic, affordable, and crafted with passion — just for you.
            </p>

            {/* SEARCH BAR */}
            <div className="mt-8 flex gap-3 justify-center lg:justify-start">
              <input
                type="text"
                placeholder="Search meals..."
                className="w-full lg:w-72 px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              />
              <button className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:scale-105 transition shadow-lg">
                Search
              </button>
            </div>

            {/* CTA BUTTONS */}
            <div className="mt-8 flex gap-4 justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.08 }}
                className="px-7 py-3 bg-yellow-400 text-gray-900 font-bold rounded-full shadow-2xl"
              >
                Order Now
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.08 }}
                className="px-7 py-3 border border-yellow-400 text-yellow-400 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition"
              >
                Become a Chef
              </motion.button>
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            className="flex-1 flex justify-center relative"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
          >
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>

            <img
              src="https://images.pexels.com/photos/2814828/pexels-photo-2814828.jpeg"
              alt="Chef"
              className="relative w-full max-w-md rounded-3xl shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
            />
          </motion.div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-yellow-400">
        ↓
      </div>

      {/* NEXT SECTIONS (UNCHANGED) */}
      <DailyMealsSection />
      <HomeReviewsSection />
      <ChefsSection />
      <CategoriesSection></CategoriesSection>
      <HowItWorksSection></HowItWorksSection>
      <TipsSection></TipsSection>
      <FAQSection></FAQSection>
      <TrustSafetySection></TrustSafetySection>
      <WhyChooseUs></WhyChooseUs>
    </section>
  );
};

export default Hero;
