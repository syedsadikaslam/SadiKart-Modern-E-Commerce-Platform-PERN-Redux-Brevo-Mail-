import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { toast } from "react-toastify";

//  FETCH MY ORDERS
export const fetchMyOrders = createAsyncThunk(
  "order/orders/me",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/order/orders/me");
      return res.data.myOrders;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

//  PLACE ORDER → returns paymentIntent + total_price
export const placeOrder = createAsyncThunk(
  "order/new",
  async (data, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/order/new", data);

      toast.success(res.data.message);
      return res.data;

    } catch (error) {
      toast.error(error.response.data.message || "Failed to place order, try again.");
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    myOrders: [],
    fetchingOrders: false,
    placingOrder: false,
    paymentIntent: "",
    finalPrice: null,
    orderStep: 1,
  },
  reducers: {
    setOrderStep: (state, action) => {
      state.orderStep = action.payload;
    },
  },
  extraReducers: (builder) => {
    /* FETCH ORDERS */
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.fetchingOrders = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.fetchingOrders = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state) => {
        state.fetchingOrders = false;
      });

    /* PLACE ORDER */
    builder
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.paymentIntent = action.payload.paymentIntent;
        state.finalPrice = action.payload.total_price;
        // move to payment step
        state.orderStep = 2;
      })
      .addCase(placeOrder.rejected, (state) => {
        state.placingOrder = false;
      });
  },
});

export default orderSlice.reducer;
export const { toggleOrderstep } = orderSlice.actions;
