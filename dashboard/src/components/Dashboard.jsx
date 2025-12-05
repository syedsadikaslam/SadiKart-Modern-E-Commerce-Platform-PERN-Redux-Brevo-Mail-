import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

import Header from "./Header";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";

import { getDashboardStats } from "../store/slices/adminSlice";


const Dashboard = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  return (
    <div className="p-2 pt-10">
      <Header />

      <MiniSummary />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <MonthlySalesChart />
        <OrdersChart />
      </div>

      <Stats />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <TopProductsChart />
        <TopSellingProducts />
      </div>
    </div>
  );
};

export default Dashboard;
