import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },

  reducers: {
    // ADD TO CART
    addToCart(state, action) {
      const { product, quantity = 1 } = action.payload;

      const existingItem = state.cart.find(
        (item) => item.product.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.cart.push({ product, quantity });
      }
    },

    // REMOVE FROM CART
    removeFromCart(state, action) {
      const { id } = action.payload;      // <-- Extract ID safely
      state.cart = state.cart.filter(
        (item) => item.product.id !== id
      );
    },

    // UPDATE QUANTITY
    updateCartQuantity(state, action) {    // <-- Correct name
      const { id, quantity } = action.payload;

      const item = state.cart.find(
        (item) => item.product.id === id
      );

      if (item) {
        item.quantity = quantity;
      }
    },

    // CLEAR CART
    clearCart(state) {
      state.cart = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
