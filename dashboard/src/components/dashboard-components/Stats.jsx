import React from "react";
import { useSelector } from "react-redux";

const Stats = () => {
  const { stats } = useSelector((state) => state.admin);

  if (!stats) return null;

  return (
    <div className="bg-white p-4 rounded-xl shadow-md mt-4">
      <h3 className="font-semibold mb-4">Statistics</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.keys(stats).map((key, i) => (
          <div
            key={i}
            className="p-3 border rounded-xl bg-gray-50 text-center"
          >
            <p className="text-sm text-gray-500 capitalize">{key}</p>
            <h2 className="text-lg font-semibold">{stats[key]}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
