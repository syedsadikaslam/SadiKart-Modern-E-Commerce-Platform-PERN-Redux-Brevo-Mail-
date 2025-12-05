import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await axiosInstance.get("/order/admin/getall");
      return data.orders; // backend returns orders[]
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status }, thunkAPI) => {
    try {
      const { data } = await axiosInstance.put(
        `/order/admin/update/${orderId}`,
        { status }
      );

      toast.success("Order status updated!");
      return data.updatedOrder; // backend returns updatedOrder object
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
      return thunkAPI.rejectWithValue("Failed to update");
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (orderId, thunkAPI) => {
    try {
      const { data } = await axiosInstance.delete(
        `/order/admin/delete/${orderId}`
      );

      toast.success("Order deleted");
      return orderId; // return ID to remove from frontend
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete order");
      return thunkAPI.rejectWithValue("Failed to delete");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    loading: false,
    orders: [],
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH ALL ORDERS
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE ORDER
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;

        const index = state.orders.findIndex(
          (o) => o.id === updated.id
        );

        if (index !== -1) {
          state.orders[index] = {
            ...state.orders[index],
            ...updated,
          };
        }
      })

      // DELETE ORDER
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (order) => order.id !== action.payload
        );
      });
  },
});

export default orderSlice.reducer;
