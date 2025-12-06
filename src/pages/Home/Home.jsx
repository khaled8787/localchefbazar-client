import React from "react";
import { motion } from "framer-motion";
import ChefsSection from "../../chefSection";
import DailyMealsSection from "../../DailyMealsSection";

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-50 to-white py-16 px-6">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center gap-12">

        {/* LEFT CONTENT */}
        <motion.div
          className="flex-1 text-center lg:text-left"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Fresh, Homemade Meals  
            <span className="text-blue-600"> Delivered to You.</span>
          </h1>

          <p className="mt-4 text-gray-600 text-lg max-w-xl">
            Discover delicious home-cooked meals prepared by talented local chefs.  
            Enjoy healthy, hygienic food at affordable prices — anytime, anywhere.
          </p>

          {/* SEARCH BAR */}
          <div className="mt-6 flex gap-2 justify-center lg:justify-start">
            <input
              type="text"
              placeholder="Search meals..."
              className="input input-bordered w-full lg:w-72"
            />
            <button className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
              Search
            </button>
          </div>

          {/* CTA BUTTONS */}
          <div className="mt-6 flex gap-4 justify-center lg:justify-start">
            <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
              Order Now
            </button>
            <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition">
              Become a Chef
            </button>
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div
          className="flex-1 flex justify-center"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://media.istockphoto.com/id/970096086/photo/people-in-a-cooking-class-enjoying-their-time.jpg?b=1&s=612x612&w=0&k=20&c=iUqqxEwsZn3rT3y1IF-U0hRfXLtumxiHW8EGGPpsxro="
            alt="Chef"
            className="w-full max-w-md drop-shadow-lg"
          />
        </motion.div>
      </div>

      <DailyMealsSection></DailyMealsSection>

      <ChefsSection></ChefsSection>

      
    </section>

    
  );
};

export default Hero;
