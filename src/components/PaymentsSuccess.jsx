import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 text-center max-w-md w-full animate-fadeIn">
        <h2 className="text-4xl md:text-5xl font-bold text-green-600 mb-4">
          Payment Successful 🎉
        </h2>
        <p className="text-gray-700 mb-6">
          Your order has been paid successfully. Thank you for your purchase!
        </p>

        <Link
          to="/my-orders"
          className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;
