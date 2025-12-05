import React from "react";
import { useSelector } from "react-redux";

const TopSellingProducts = () => {
  const { topSellingProducts } = useSelector((state) => state.admin);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h3 className="font-semibold mb-3">Top Selling Products</h3>

      {topSellingProducts?.length === 0 ? (
        <p className="text-gray-500">No products sold yet.</p>
      ) : (
        <ul className="space-y-3">
          {topSellingProducts.map((p, i) => (
            <li
              key={p.id || p._id || i}
              className="flex justify-between items-center p-3 border rounded-lg bg-gray-50"
            >
              <span className="font-medium">{p.name}</span>
              <span className="font-semibold text-green-600">
                Sold: {p.sold || 0}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TopSellingProducts;
