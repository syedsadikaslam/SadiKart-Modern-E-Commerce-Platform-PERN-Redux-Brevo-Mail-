import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
 import {
  fetchAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../store/slices/orderSlice";

const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

const badgeColors = {
  Processing: "bg-yellow-100 text-yellow-800",
  Shipped: "bg-blue-100 text-blue-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  const [selectedStatus, setSelectedStatus] = useState({});
  const [filterByStatus, setFilterByStatus] = useState("All");
  const [previewImage, setPreviewImage] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    setSelectedStatus((prev) => ({ ...prev, [orderId]: newStatus }));
    dispatch(updateOrderStatus({ orderId, status: newStatus }));
  };

  const filteredOrders =
    filterByStatus === "All"
      ? orders
      : orders.filter((order) => order.order_status === filterByStatus);

  if (loading) {
    return (
      <div className="flex justify-center mt-40">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="p-2 pt-10">
 
      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500">Track and manage customer orders.</p>
      </div>

      {/* FILTER */}
      <div className="flex justify-end mb-6">
        <select
          onChange={(e) => setFilterByStatus(e.target.value)}
          className="px-4 py-2 bg-white border rounded shadow-sm"
        >
          {statusArray.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* ORDER CARDS */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200"
          >
            {/* Top Row */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-gray-500 text-sm">Order ID</p>
                <p className="font-semibold">{order.id}</p>
              </div>

              <span
                className={`px-3 py-1 text-sm rounded-full font-medium ${
                  badgeColors[order.order_status]
                }`}
              >
                {order.order_status}
              </span>

              <div>
                <p className="text-gray-500 text-sm">Amount</p>
                <p className="font-bold text-lg">₹{order.total_price}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Date</p>
                <p>{new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Status + Delete */}
            <div className="mt-4 flex gap-4">
              <select
                value={selectedStatus[order.id] || order.order_status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className="px-3 py-2 bg-gray-50 border rounded"
              >
                {statusArray
                  .filter((s) => s !== "All")
                  .map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>

              <button
                onClick={() => setDeleteConfirm({ open: true, id: order.id })}
                className="px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600"
              >
                Delete
              </button>
            </div>

            {/* Shipping Info */}
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Shipping Information</h3>
              <p><strong>Name:</strong> {order.shipping_info.full_name}</p>
              <p><strong>Phone:</strong> {order.shipping_info.phone}</p>
              <p>
                <strong>Address:</strong>{" "}
                {order.shipping_info.address}, {order.shipping_info.city}
              </p>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Items</h3>

              <div className="space-y-3">
                {order.order_items.map((item) => (
                  <div
                    key={item.order_item_id}
                    className="flex items-center gap-4 bg-white border rounded p-3 shadow-sm"
                  >
                    <img
                      src={item.image}
                      className="w-16 h-16 rounded-md object-cover cursor-pointer hover:scale-105 transition"
                      onClick={() => setPreviewImage(item.image)}
                    />

                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                      <p className="text-gray-600 text-sm">Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm.open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-80">
            <h3 className="text-lg font-bold text-center">Delete Order?</h3>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() => {
                  dispatch(deleteOrder(deleteConfirm.id));
                  setDeleteConfirm({ open: false, id: null });
                }}
                className="px-5 py-2 bg-red-600 text-white rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteConfirm({ open: false, id: null })}
                className="px-5 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center"
        >
          <img
            src={previewImage}
            className="max-w-[85%] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
};

export default Orders;
