import { createSlice } from "@reduxjs/toolkit";

const extraSlice = createSlice({
  name: "extra",
  initialState: {
    openedComponent: "Dashboard",
    isNavbarOpened: false,
    isViewProductModalOpened: false,
    isCreateProductModalOpened: false,
    isUpdateProductModalOpened: false,
    productToUpdate: null,
  },
  reducers: {
    toggleComponent: (state, action) => {
      state.openedComponent = action.payload;
    },

    toggleNavbar: (state) => {
      state.isNavbarOpened = !state.isNavbarOpened;
    },

    toggleCreateProductModal: (state) => {
      state.isCreateProductModalOpened = !state.isCreateProductModalOpened;
    },

    toggleViewProductModal: (state) => {
      state.isViewProductModalOpened = !state.isViewProductModalOpened;
    },

    toggleUpdateProductModal: (state, action) => {
      state.isUpdateProductModalOpened = !state.isUpdateProductModalOpened;
      state.productToUpdate = action.payload || null;
    },
  },
});

export const {
  toggleComponent,
  toggleCreateProductModal,
  toggleNavbar,
  toggleUpdateProductModal,
  toggleViewProductModal,
} = extraSlice.actions;

export default extraSlice.reducer;
