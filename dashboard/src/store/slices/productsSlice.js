import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-toastify";

// GET ALL PRODUCTS
export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (query = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(query).toString();
      const { data } = await axiosInstance.get(`/product?${params}`); // FIXED
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// CREATE PRODUCT
export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post(
        `/product/admin/create`,      // FIXED
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// UPDATE PRODUCT
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, body }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.put(
        `/product/admin/update/${productId}`,   // FIXED
        body
      );
      return data.updatedProduct;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/product/admin/delete/${productId}`); // FIXED
      return productId;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    totalProducts: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message || "Failed to fetch products");
      })

      // CREATE
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.unshift(action.payload);
        toast.success("Product created successfully!");
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.payload.message || "Failed to create product");
      })

      // UPDATE
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.products = state.products.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
        toast.success("Product updated");
      })

      // DELETE
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p.id !== action.payload);
        toast.success("Product deleted");
      });
  },
});

export default productSlice.reducer;
