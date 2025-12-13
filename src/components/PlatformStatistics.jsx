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

  // Prepare Pie chart data dynamically
  const orderData = [
    { name: "Pending Orders", value: stats.ordersPending },
    { name: "Delivered Orders", value: stats.ordersDelivered },
  ];

  const COLORS = ["#FFA500", "#00C49F"]; // Orange = Pending, Green = Delivered
   console.log("Order Data:", orderData);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-orange-600 mb-8 text-center"
      >
        Platform Statistics
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold text-orange-500">{stats.totalUsers}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Total Payment ($)</h2>
          <p className="text-3xl font-bold text-orange-500">{stats.totalPayments}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Orders Pending</h2>
          <p className="text-3xl font-bold text-orange-500">{stats.ordersPending}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <h2 className="text-lg font-semibold mb-2">Orders Delivered</h2>
          <p className="text-3xl font-bold text-orange-500">{stats.ordersDelivered}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Pie Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Orders Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {orderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} orders`, name]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Bar Chart */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">Payment Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={[{ name: "Total Payment", value: stats.totalPayments }]}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Bar dataKey="value" fill="#FFA500" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PlatformStatistics;
