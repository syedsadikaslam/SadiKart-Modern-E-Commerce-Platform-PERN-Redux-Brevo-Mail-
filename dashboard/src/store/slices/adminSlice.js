import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";
import { getLastNMonths } from "../../lib/helper";

const initialState = {
  loading: false,

  users: [],
  totalUsers: 0,

  summary: {
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0,
    lowStock: 0,
  },

  monthlySales: [],
  orderStatusCounts: {},

  topSellingProducts: [],
  topProductsChart: [],

  stats: {},
};

export const adminSlice = createSlice({
  name: "admin",
  initialState,

  reducers: {
    requestStart: (state) => {
      state.loading = true;
    },

    dashboardSuccess: (state, action) => {
      state.loading = false;
      const p = action.payload;

      //  Extract sold count universally
      const extractSold = (item) =>
        Number(item.total_sold || item.sold || item.quantity || item.qty || 0);

      //  Fix top selling products
      const fixedTopSelling = (p.topSellingProducts || []).map((item) => ({
        ...item,
        sold: extractSold(item),
      }));

      //  Total sold
      const totalSold = fixedTopSelling.reduce((sum, i) => sum + Number(i.sold), 0);

      //  Total orders from orderStatusCounts
      const totalOrders = Object.values(p.orderStatusCounts || {}).reduce(
        (sum, v) => sum + Number(v || 0),
        0
      );

      //  Summary cards
      state.summary = {
        totalRevenue: p.totalRevenueAllTime || 0,
        totalOrders,
        activeUsers: p.totalUsersCount || 0,
        lowStock: p.lowStockProducts?.length || 0,
      };

      //  Store top selling products
      state.topSellingProducts = fixedTopSelling;

      //  Order status pie chart data
      state.orderStatusCounts = p.orderStatusCounts || {};

      //  Top Products Chart (Bar Chart)
      state.topProductsChart = fixedTopSelling.map((item) => ({
        name: item.name,
        sales: Number(item.sold),
      }));

      //  Monthly sales 
      
      const last12 = getLastNMonths(12); 
      const backendSales = (p.monthlySales || []).map((item) => ({
        month: item.month,
        value: Number(item.totalsales || item.totalSales || item.value || 0),
      }));

      state.monthlySales = last12.map((m) => {
        const found = backendSales.find((b) => b.month === m.month);
        return {
          name: m.month,
          value: found ? found.value : 0,
        };
      });

      //  Extra stats
      state.stats = {
        todayRevenue: p.todayRevenue || 0,
        yesterdayRevenue: p.yesterdayRevenue || 0,
        revenueGrowth: p.revenueGrowth || "0%",
        newUsersThisMonth: p.newUsersThisMonth || 0,
        currentMonthSales: p.currentMonthSales || totalSold,
      };
    },

    requestFail: (state) => {
      state.loading = false;
    },

    //  USERS 
    getAllUsersRequest: (state) => {
      state.loading = true;
    },
    getAllUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload.users;
      state.totalUsers = action.payload.totalUsers;
    },
    getAllUsersFailed: (state) => {
      state.loading = false;
    },

    deleteUserRequest: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.loading = false;

      state.users = state.users.filter((u) => (u.id || u._id) !== action.payload);

      state.totalUsers = Math.max(0, state.totalUsers - 1);
    },
    deleteUserFailed: (state) => {
      state.loading = false;
    },
  },
});

export const {
  requestStart,
  dashboardSuccess,
  requestFail,
  getAllUsersRequest,
  getAllUsersSuccess,
  getAllUsersFailed,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFailed,
} = adminSlice.actions;

export default adminSlice.reducer;

//  THUNKS 

export const getDashboardStats = () => async (dispatch) => {
  dispatch(requestStart());
  try {
    const res = await axiosInstance.get("/admin/fetch/dashboard-stats");
    dispatch(dashboardSuccess(res.data));
  } catch (err) {
    dispatch(requestFail());
    
  }
};

// FETCH ALL USER
export const fetchAllUsers = (page = 1) => async (dispatch) => {
  dispatch(getAllUsersRequest());
  try {
    const res = await axiosInstance.get(`/admin/getallusers?page=${page}`);
    dispatch(getAllUsersSuccess(res.data));
  } catch (err) {
    dispatch(getAllUsersFailed());
   
  }
};

// DELETE USER
export const deleteUser =
  (id, page = 1) =>
  async (dispatch, getState) => {
    dispatch(deleteUserRequest());
    try {
      const res = await axiosInstance.delete(`/admin/delete/${id}`);
      dispatch(deleteUserSuccess(id));
      toast.success(res.data.message || "User deleted successfully.");

      const updatedTotal = getState().admin.totalUsers;
      const maxPage = Math.ceil(updatedTotal / 10) || 1;

      dispatch(fetchAllUsers(Math.min(page, maxPage)));
    } catch (error) {
      dispatch(deleteUserFailed());
      toast.error(error.response?.data?.message || "Failed to delete user.");
    }
  };
