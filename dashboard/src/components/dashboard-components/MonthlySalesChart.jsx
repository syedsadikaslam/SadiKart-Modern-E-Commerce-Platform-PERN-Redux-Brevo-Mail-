import React from "react";
import { useSelector } from "react-redux";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MonthlySalesChart = () => {
  const { monthlySales } = useSelector((state) => state.admin);

  console.log("📊 MONTHLY SALES DATA:", monthlySales);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold mb-2">Monthly Sales</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthlySales}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesChart;
