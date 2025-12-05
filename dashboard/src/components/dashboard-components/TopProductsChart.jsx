import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TopProductsChart = () => {
  const { topProductsChart } = useSelector((state) => state.admin);

  const formattedData = topProductsChart?.map((item) => ({
    name: item.name || item.productName || "Unknown",
    sales: item.sales || item.totalSold || 0,
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold mb-2">Top Products Chart</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={formattedData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="sales" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProductsChart;
