import { useState, useEffect } from "react";
import { ArrowLeft, Check, XCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { placeOrder } from "../store/slices/orderSlice";

const Payment = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.auth?.authUser);
  const cart = useSelector((state) => state.cart.cart) || [];
  const { orderStep } = useSelector((state) => state.order);

  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    if (!authUser) {
      setShowLoginAlert(true);
    }
  }, [authUser]);


  useEffect(() => {
    if (!cart || cart.length === 0) navigate("/cart");
  }, [cart, navigate]);

  const [shippingDetails, setShippingDetails] = useState({
    fullName: "",
    state: "",
    city: "",
    phone: "",
    address: "",
    zipcode: "",
    country: "India",
  });

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const tax = subtotal * 0.18;
  const shippingCharge = subtotal >= 500 ? 0 : cart.length ? 50 : 0;
  const totalAmount = subtotal + tax + shippingCharge;

  // PLACE ORDER (COD)
  const [clicked, setClicked] = useState(false);

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (clicked) return;  
    setClicked(true);
    const formData = new FormData();

    formData.append("full_name", shippingDetails.fullName);
    formData.append("state", shippingDetails.state);
    formData.append("city", shippingDetails.city);
    formData.append("country", shippingDetails.country);
    formData.append("address", shippingDetails.address);
    formData.append("pincode", shippingDetails.zipcode);
    formData.append("phone", shippingDetails.phone);
    formData.append("payment_method", "COD");
    formData.append("orderedItems", JSON.stringify(cart));

    dispatch(placeOrder(formData));
  };

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-background to-muted/20">
      {/* LOGIN ALERT MODAL */}
      {showLoginAlert && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-card p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-border">
            <div className="flex justify-center mb-4">
              <XCircle className="w-14 h-14 text-red-500" />
            </div>

            <h2 className="text-2xl font-semibold text-center mb-2">
              Login Required
            </h2>

            <p className="text-muted-foreground text-center mb-6">
              You must login first to place an order.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-primary text-white rounded-xl text-lg shadow hover:opacity-90 transition"
            >
              Go to Login
            </button>

            <button
              onClick={() => navigate("/products")}
              className="w-full mt-3 py-3 bg-muted rounded-xl shadow text-sm text-muted-foreground hover:bg-muted/70"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      {/* MAIN PAGE */}
      <div className="container mx-auto px-4 pb-20">

        {/* BACK BUTTON */}
        <div className="flex items-center mb-6">
          <Link to="/cart" className="flex items-center gap-2 text-primary hover:underline">
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
        </div>

        {/* TOP HEADING */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground text-sm">
            Fill your shipping details and confirm your order.
          </p>
        </div>

        {/* STEPS */}
        <div className="flex items-center justify-center mb-16 gap-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow ${orderStep >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
            >
              {orderStep > 1 ? <Check className="w-5 h-5" /> : 1}
            </div>
            <span className="font-medium">Shipping</span>
          </div>

          <div className={`h-1 w-14 rounded-full ${orderStep >= 2 ? "bg-primary" : "bg-muted"}`} />

          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shadow ${orderStep >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                }`}
            >
              2
            </div>
            <span className="font-medium">Confirm</span>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2">

            {/* STEP 1 SHIPPING FORM */}
            {orderStep === 1 && (
              <form
                onSubmit={handlePlaceOrder}
                className="rounded-2xl bg-white dark:bg-gray-900 p-8 shadow-lg 
                border border-gray-200 dark:border-gray-800 space-y-8"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  Shipping Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {[
                    { label: "Full Name", key: "fullName" },
                    { label: "Phone Number", key: "phone" },
                    { label: "Address", key: "address", span: true },
                    { label: "City", key: "city" },
                    { label: "State", key: "state" },
                    { label: "Zipcode", key: "zipcode" },
                  ].map((field) => (
                    <div
                      key={field.key}
                      className={`relative ${field.span ? "md:col-span-2" : ""}`}
                    >
                      <input
                        type="text"
                        required
                        value={shippingDetails[field.key]}
                        onChange={(e) =>
                          setShippingDetails({ ...shippingDetails, [field.key]: e.target.value })
                        }
                        className="
                         w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800
                         border border-gray-300 dark:border-gray-700 
                         text-gray-900 dark:text-white
                         outline-none peer
                        focus:border-primary focus:ring-1 focus:ring-primary"
                      />

                      {/* LABEL ALWAYS FLOATS WHEN VALUE EXISTS */}
                      <label
                        className={`
                        absolute left-4 px-1 transition-all duration-200
                         bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400
                        pointer-events-none
                        ${shippingDetails[field.key]
                            ? "-top-2 text-xs text-primary"
                            : "top-4 text-base"
                          }
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-primary`}
                      >
                        {field.label}
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  disabled={clicked}
                  className={`w-full py-4 text-lg font-semibold rounded-xl text-white
                  bg-gradient-to-r from-primary to-primary/70
                  flex items-center justify-center gap-2 transition relative overflow-hidden
                  ${clicked ? "opacity-60 cursor-not-allowed active:scale-100" : ""}`}
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-20 transition"></span>

                  {clicked ? (
                    <span className="animate-spin">⏳</span>
                  ) : (
                    <span className="animate-pulse">💸</span>
                  )}

                  <span>{clicked ? "Placing Order..." : "Confirm Cash On Delivery"}</span>
                </button>

              </form>
            )}


            {/* STEP 2 CONFIRMATION */}
            {orderStep === 2 && (
              <div className="rounded-2xl bg-card p-10 shadow-xl text-center border border-border">
                <Check className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h2 className="text-2xl font-semibold mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Your Cash on Delivery order has been placed successfully.
                </p>

                <button
                  onClick={() => navigate("/orders")}
                  className="btn-primary px-6 py-3"
                >
                  View My Orders
                </button>
              </div>
            )}

          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="rounded-2xl bg-card p-8 shadow-xl border border-border sticky top-28 h-fit">
            <h3 className="text-xl font-semibold mb-5">Order Summary</h3>

            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center border-b border-border pb-3"
                >
                  <span className="text-sm">{item.product.name}</span>
                  <span className="font-semibold">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between py-1 text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1 text-sm">
              <span>Tax (18%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-1 text-sm">
              <span>Shipping</span>
              <span>{shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}</span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Payment;
