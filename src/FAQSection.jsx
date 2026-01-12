import { motion } from "framer-motion";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "LocalChefBazaar কীভাবে কাজ করে?",
    answer:
      "LocalChefBazaar স্থানীয় দক্ষ শেফদের সাথে গ্রাহকদের যুক্ত করে। আপনি আপনার পছন্দের খাবার অর্ডার করবেন, আর শেফ তা প্রস্তুত করে আপনার কাছে পৌঁছে দেবে।",
  },
  {
    id: 2,
    question: "খাবারের মান ও স্বাস্থ্যবিধি কীভাবে নিশ্চিত করা হয়?",
    answer:
      "সব শেফ ভেরিফায়েড এবং স্বাস্থ্যবিধি মেনে রান্না করেন। প্রতিটি খাবার হাইজিনিক পরিবেশে প্রস্তুত করা হয়।",
  },
  {
    id: 3,
    question: "আমি কি নিজেও শেফ হিসেবে যোগ দিতে পারি?",
    answer:
      "হ্যাঁ, আপনি চাইলে শেফ হিসেবে রেজিস্ট্রেশন করতে পারবেন এবং আপনার তৈরি খাবার বিক্রি করতে পারবেন।",
  },
  {
    id: 4,
    question: "পেমেন্ট কীভাবে করা যায়?",
    answer:
      "আপনি নিরাপদ অনলাইন পেমেন্ট সিস্টেমের মাধ্যমে সহজেই পেমেন্ট করতে পারবেন।",
  },
  {
    id: 5,
    question: "অর্ডার বাতিল বা রিফান্ড কি সম্ভব?",
    answer:
      "হ্যাঁ, নির্দিষ্ট সময়ের মধ্যে অর্ডার বাতিল করলে রিফান্ড পলিসি অনুযায়ী রিফান্ড দেওয়া হয়।",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

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
        ❓ Frequently Asked <span className="text-white">Questions</span>
      </motion.h2>

      {/* FAQ Items */}
      <div className="max-w-4xl mx-auto px-6 space-y-6 relative">
        {faqs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 border border-gray-700 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] overflow-hidden"
          >
            {/* Question */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center px-6 py-5 text-left"
            >
              <span className="text-lg font-semibold text-gray-200">
                {faq.question}
              </span>
              <FaChevronDown
                className={`text-orange-400 transition-transform duration-300 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Answer */}
            {activeIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="px-6 pb-5 text-gray-300 text-sm leading-relaxed"
              >
                {faq.answer}
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
