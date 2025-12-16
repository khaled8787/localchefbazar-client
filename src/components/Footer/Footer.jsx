import React from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-neutral text-neutral-content">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p className="text-sm mb-2">📍 Natore, Bangladesh</p>
          <p className="text-sm mb-2">📞 +880 17XX-XXXXXX</p>
          <p className="text-sm">✉️ support@localchefbazaar.com</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Working Hours</h3>
          <p className="text-sm mb-2">Saturday - Thursday</p>
          <p className="text-sm mb-2">⏰ 9:00 AM - 10:00 PM</p>
          <p className="text-sm">Friday: Closed</p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:underline cursor-pointer">About Us</li>
            <li className="hover:underline cursor-pointer">Contact</li>
            <li className="hover:underline cursor-pointer">Privacy Policy</li>
            <li className="hover:underline cursor-pointer">Terms & Conditions</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <a className="btn btn-circle btn-outline" href="#">
              <FaFacebookF />
            </a>
            <a className="btn btn-circle btn-outline" href="#">
              <FaInstagram />
            </a>
            <a className="btn btn-circle btn-outline" href="#">
              <FaTwitter />
            </a>
            <a className="btn btn-circle btn-outline" href="#">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

      </div>

      <div className="border-t border-neutral-content/20 py-4 text-center text-sm">
        © {new Date().getFullYear()} LocalChefBazaar. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
