import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-300 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,165,0,0.15),transparent_65%)]"></div>

      <div className="relative max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-xl font-bold text-orange-400 mb-4">
            Contact Us
          </h3>
          <p className="text-sm mb-2">📍 Natore, Bangladesh</p>
          <p className="text-sm mb-2">📞 +880 1737878716</p>
          <p className="text-sm">✉️ mdkhaledmahmud01737.com</p>
        </motion.div>

        {/* Working Hours */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="text-xl font-bold text-orange-400 mb-4">
            Working Hours
          </h3>
          <p className="text-sm mb-2">Saturday - Thursday</p>
          <p className="text-sm mb-2">⏰ 9:00 AM - 10:00 PM</p>
          <p className="text-sm text-red-400">Friday: Closed</p>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-xl font-bold text-orange-400 mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              "About Us",
              "Contact",
              "Privacy Policy",
              "Terms & Conditions",
            ].map((item, i) => (
              <li
                key={i}
                className="hover:text-orange-400 transition cursor-pointer"
              >
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Social */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h3 className="text-xl font-bold text-orange-400 mb-4">
            Follow Us
          </h3>
          <div className="flex gap-4">
            {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map(
              (Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.15 }}
                  className="w-11 h-11 flex items-center justify-center rounded-full border border-gray-700 hover:border-orange-500 hover:text-orange-400 transition"
                  href="#"
                >
                  <Icon />
                </motion.a>
              )
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom */}
      <div className="relative border-t border-gray-700 py-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="text-orange-400 font-semibold">
          LocalChefBazaar
        </span>
        . All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
