import React from "react";
import {
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  updateCartQuantity,
  removeFromCart,
} from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateCartQuantity({
          id: item.product.id,
          quantity: item.quantity - 1,
        })
      );
    }
  };

  const handleIncrease = (item) => {
    dispatch(
      updateCartQuantity({
        id: item.product.id,
        quantity: item.quantity + 1,
      })
    );
  };

  const handleRemove = (id) => dispatch(removeFromCart({ id }));

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const shipping = subtotal >= 500 ? 0 : cart.length ? 50 : 0;
  const tax = +(subtotal * 0.18).toFixed(2);
  const total = subtotal + shipping + tax;

  return (
    <>
      <div className="min-h-screen bg-gray-100 dark:bg-black text-black dark:text-white px-3 py-4">

        {/* HEADER */}
        <div className="pt-10 mb-2">
          <h1 className="text-xl font-semibold py-3">Shopping Cart</h1>
          <p className="text-sm text-muted-foreground">
            {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {/* EMPTY CART */}
        {cart.length === 0 ? (
          <div className="text-center mt-16">
            <img
              src="/cart.png"
              className="w-40 mx-auto opacity-80 dark:opacity-90 dark:invert"
              alt="Empty Cart"
            />

            <p className="text-lg mt-4 text-gray-600 dark:text-gray-200">
              Your cart is empty
            </p>

            <Link
              to="/"
              className="
              mt-6 inline-block bg-primary text-white 
              dark:bg-white dark:text-black px-5 py-3 rounded-xl shadow hover:shadow-lg transition"
            >
              Continue Shopping
            </Link>
          </div>

        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-3">

              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex bg-white dark:bg-gray-800 rounded-xl p-3 shadow-md"
                >
                  {/* IMAGE */}
                  <img
                    src={item.product.images?.[0]?.url}
                    className="w-20 h-20 object-contain rounded-md bg-gray-100 dark:bg-gray-700 p-1"
                  />

                  {/* DETAILS */}
                  <div className="flex-1 ml-3">
                    <p className="text-sm font-semibold leading-tight line-clamp-2">
                      {item.product.name}
                    </p>

                    <p className="text-primary font-bold text-lg mt-1">
                      ₹{item.product.price * item.quantity}
                    </p>

                    {/* QUANTITY */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleDecrease(item)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center active:scale-95 transition"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="text-lg font-bold">{item.quantity}</span>

                      <button
                        onClick={() => handleIncrease(item)}
                        className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex justify-center items-center active:scale-95 transition"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* REMOVE */}
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    className="text-red-500 ml-3 self-start"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

            </div>

            {/* ORDER SUMMARY */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md h-fit sticky top-5">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="space-y-2 text-base">

                <div className="flex justify-between">
                  <span>
                    Subtotal (<b>{cart.length}</b> items)
                  </span>
                  <span>₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0 ? "Free" : `₹${shipping}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{tax}</span>
                </div>

                <hr className="my-2 border-gray-300 dark:border-gray-700" />

                <div className="flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* CHECKOUT */}
              <Link
                to="/checkout"
                className="mt-6 w-full flex justify-center items-center gap-2 
               bg-primary text-white py-3 rounded-xl font-semibold 
               shadow-md hover:shadow-xl active:scale-95 transition
               dark:bg-blue-600 dark:text-white dark:border dark:border-blue-400"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </Link>


              {/* CONTINUE SHOPPING */}
              <Link
                to="/"
                className="mt-3 w-full flex justify-center items-center gap-2 
              bg-gray-200 dark:bg-gray-700 text-black dark:text-white 
              py-3 rounded-xl font-semibold hover:bg-gray-300 
              dark:hover:bg-gray-600 transition text-base md:text-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE ONLY FIXED CHECKOUT BUTTON */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black p-3 shadow-xl">
          <Link
            to="/checkout"
            className="w-full flex justify-center items-center gap-2 bg-primary text-white py-3 rounded-xl font-semibold"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      )}
    </>

  );
};

export default Cart;
