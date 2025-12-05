import { X, Plus, Minus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  updateCartQuantity,
} from "../../store/slices/cartSlice";
import { toggleSidebar, toggleCart } from "../../store/slices/popupSlice";
import { useMemo } from "react";

const CartSidebar = () => {
  const dispatch = useDispatch();
  const { isCartOpen } = useSelector((state) => state.popup);
  const { cart } = useSelector((state) => state.cart);

  // ✅ Global Total Calculation (FIXED)
  const total = useMemo(() => {
    if (!cart) return 0;

    return cart.reduce((sum, item) => {
      const price = Number(item?.product?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      return sum + price * qty;
    }, 0);
  }, [cart]);

  // ✅ Update Quantity (Corrected)
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart({ id }));
      return;
    }
    dispatch(updateCartQuantity({ id, quantity }));
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={() => dispatch(toggleSidebar())}
      />

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 z-50 glass-panel animate-side-in-right overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[hsla(var(--glass-border))]">
          <h2 className="text-xl font-semibold text-primary">Shopping Cart</h2>
          <button
            onClick={() => dispatch(toggleCart())}
            className="p-2 rounded-lg glass-card hover:glow-on-hover animate-smooth"
          >
            <X className="w-4 h-4 text-primary" />
          </button>
        </div>

        <div className="p-6">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Your cart is currently empty.</p>
              <Link
                to="/Products"
                onClick={() => dispatch(toggleCart())}
                className="inline-block mt-4 px-6 py-2 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.product.id} className="glass-card p-4 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-primary font-semibold">
                          ₹{item.product.price}
                        </p>
                      </div>
                    </div>

                    {/* Quantity + Delete Row */}
                    <div className="flex items-center justify-between w-full mt-3">
                      {/* Quantity */}
                      <div className="flex items-center bg-white/10 backdrop-blur-xl 
                      rounded-lg px-2 py-1 shadow-sm space-x-2">

                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md 
                          bg-white/20 hover:bg-white/30 transition-all"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-4 h-4 text-white" />
                        </button>

                        <span className="text-white text-sm font-semibold w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          className="w-7 h-7 flex items-center justify-center rounded-md 
                          bg-white/20 hover:bg-white/30 transition-all"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                        >
                          <Plus className="w-4 h-4 text-white" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        className="p-2 rounded-md bg-red-500/30 hover:bg-red-600/40 transition-all shadow-sm"
                        onClick={() => dispatch(removeFromCart({ id: item.product.id }))}
                      >
                        <Trash2 className="w-5 h-5 text-red-100" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="border-t border-[hsla(var(--glass-border))] pt-4 pb-2">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-xl font-bold text-primary">₹{total.toFixed(2)}</span>
                </div>

                <Link
                  to="/cart"
                  onClick={() => dispatch(toggleCart())}
                  className="w-full block text-center gradient-primary text-primary-foreground 
                  rounded-lg hover:glow-on-hover animate-smooth font-semibold py-2"
                >
                  View Cart & Checkout
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );

};

export default CartSidebar;
