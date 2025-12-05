import React from "react";
import { Wallet, PackageCheck, TrendingUp, AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";

const MiniSummary = () => {
  const { summary } = useSelector((state) => state.admin);

  const items = [
    {
      title: "Total Revenue",
      value: `₹${summary?.totalRevenue || 0}`,
      icon: <Wallet className="text-blue-600" />,
    },
    {
      title: "Total Orders",
      value: summary?.totalOrders || 0,
      icon: <PackageCheck className="text-green-600" />,
    },
    {
      title: "Active Users",
      value: summary?.activeUsers || 0,
      icon: <TrendingUp className="text-yellow-600" />,
    },
    {
      title: "Low Stock Items",
      value: summary?.lowStock || 0,
      icon: <AlertTriangle className="text-red-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="p-4 bg-white shadow rounded-xl flex justify-between items-center"
        >
          <div>
            <p className="text-sm text-gray-500">{item.title}</p>
            <h2 className="text-xl font-semibold">{item.value}</h2>
          </div>
          {item.icon}
        </div>
      ))}
    </div>
  );
};

export default MiniSummary;
