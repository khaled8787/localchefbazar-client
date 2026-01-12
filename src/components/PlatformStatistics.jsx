import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import useAxiosSecure from "../AxiosSecure";

const PlatformStatistics = () => {
  const axiosSecure = useAxiosSecure();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPayments: 0,
    ordersPending: 0,
    ordersDelivered: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await axiosSecure.get("/admin/platform-stats");
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const orderData = [
    { name: "Pending Orders", value: stats.ordersPending },
    { name: "Delivered Orders", value: stats.ordersDelivered },
  ];

  const COLORS = ["#FFA500", "#00C49F"];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 md:p-10">
      {/* Background Animated Circles */}
      <motion.div
        className="absolute -top-32 -left-32 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Main Container */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-orange-400 drop-shadow-[0_0_15px_rgba(255,165,0,0.7)]">
          Platform Statistics
        </h1>

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Total Users", value: stats.totalUsers, color: "orange" },
            { label: "Total Payment ($)", value: stats.totalPayments, color: "orange" },
            { label: "Orders Pending", value: stats.ordersPending, color: "yellow" },
            { label: "Orders Delivered", value: stats.ordersDelivered, color: "green" },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`bg-gray-900/70 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl p-6 text-center`}
            >
              <h2 className="text-lg font-semibold mb-2 text-white">{card.label}</h2>
              <p
                className={`text-3xl font-bold text-${
                  card.color === "orange"
                    ? "orange-400"
                    : card.color === "yellow"
                    ? "yellow-400"
                    : "green-400"
                } drop-shadow-[0_0_10px_rgba(255,165,0,0.5)]`}
              >
                {card.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders Pie Chart */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/70 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-center text-white">
              Orders Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {orderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} orders`, name]} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Payments Bar Chart */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-900/70 backdrop-blur-xl border border-gray-700 shadow-2xl rounded-3xl p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-center text-white">
              Payment Overview
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={[{ name: "Total Payment", value: stats.totalPayments }]}>
                <XAxis dataKey="name" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip formatter={(value) => `$${value}`} />
                <Bar dataKey="value" fill="#FFA500" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default PlatformStatistics;
