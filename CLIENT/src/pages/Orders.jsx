import React, { useEffect, useMemo, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyOrders } from "../store/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { authUser } = useSelector((state) => state.auth);
  const myOrders = useSelector((state) => state.order.myOrders) || [];
  const fetchingOrders = useSelector((state) => state.order.fetchingOrders);

  useEffect(() => {
    if (!authUser) navigate("/products");
  }, [authUser, navigate]);

  useEffect(() => {
    if (authUser) dispatch(fetchMyOrders());
  }, [dispatch, authUser]);

  const [statusFilter, setStatusFilter] = useState("All");
  const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = useMemo(() => {
    return myOrders.filter(
      (order) => statusFilter === "All" || order.order_status === statusFilter
    );
  }, [myOrders, statusFilter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Shipped":
        return "bg-blue-500/20 text-blue-400";
      case "Delivered":
        return "bg-green-500/20 text-green-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  const orderId = (order) => order.id ?? order._id ?? "";

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      : "-";

  const formatPrice = (amt) =>
    amt === undefined || amt === null ? "-" : `₹${amt}`;

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-2 mb-4">
        <div className="mb-3">
          <h1 className="text-lg md:text-2xl font-semibold flex items-center gap-2">
            My Orders
          </h1>
          <p className="text-sm text-muted-foreground">
            Track and manage your order history.
          </p>
        </div>

        <div className="glass-card p-3 mb-4">
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            <span className="text-xs md:text-sm font-medium flex items-center">
              <Filter className="w-4 h-4 md:w-5 md:h-5 mr-2" /> Status:
            </span>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
              {statusArray.map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${statusFilter === s
                    ? "gradient-primary text-white"
                    : "glass-card hover:bg-on-hover-text-foreground"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LOADING */}
      {fetchingOrders && (
        <div className="text-center text-sm text-muted-foreground py-4">
          Loading your orders…
        </div>
      )}

      {/* EMPTY LIST */}
      {!fetchingOrders && filteredOrders.length === 0 && (
        <div className="text-center glass-panel max-w-xs mx-auto mb-6 p-5">
          <h2 className="text-lg font-semibold mb-2">No Orders Found</h2>
          <Package className="w-14 h-14 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {statusFilter === "All"
              ? "You haven't placed any orders yet."
              : `No orders with status ${statusFilter}.`}
          </p>
        </div>
      )}

      {/* ORDER LIST */}
      {!fetchingOrders && filteredOrders.length > 0 && (
        <div className="container mx-auto px-4">
          {filteredOrders.map((order) => (
            <div
              key={orderId(order)}
              className="glass-card p-4 mb-5 rounded-xl shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-base font-semibold">
                    Order #{orderId(order)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusIcon(order.order_status)}
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${getStatusColor(
                      order.order_status
                    )}`}
                  >
                    {order.order_status}
                  </span>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(order.total_price)}
                  </p>
                </div>
              </div>

              <hr className="my-3 border-gray-700" />

              <div className="space-y-3">
                {order.order_items?.map((item) => (
                  <div
                    key={item.product_id}
                    className="flex items-center gap-3 p-3 bg-secondary/20 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-14 h-14 object-cover rounded-lg"
                    />

                    <div className="flex flex-col min-w-0">
                      <h4 className="font-medium text-sm truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="ml-auto text-right">
                      <span className="font-semibold text-sm">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[hsla(var(--glass-border))]">
                <button
                  onClick={() => navigate(`/orders/${orderId(order)}`)}
                  className="px-4 py-2 glass-card hover:glow-on-hover text-sm"
                >
                  View Details
                </button>

                <button
                  onClick={() => navigate(`/orders/${orderId(order)}/track`)}
                  className="px-4 py-2 glass-card hover:glow-on-hover text-sm"
                >
                  Track Order
                </button>

                {order.order_status === "Delivered" && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/product/${order.order_items[0].product_id}#reviews`)
                      }
                      className="px-4 py-2 glass-card hover:glow-on-hover text-sm"
                    >
                      Write Review
                    </button>

                    <button
                      className="px-4 py-2 glass-card hover:glow-on-hover text-sm"
                      onClick={() => navigate(`/product/${order.order_items[0].product_id}`)}
                    >
                      Reorder
                    </button>

                  </>
                )}

                {order.order_status === "Processing" && (
                  <button className="px-4 py-2 glass-card hover:glow-on-hover text-sm text-destructive">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
