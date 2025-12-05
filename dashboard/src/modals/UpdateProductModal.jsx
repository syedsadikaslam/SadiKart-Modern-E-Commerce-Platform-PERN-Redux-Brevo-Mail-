import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateProduct } from "../store/slices/productsSlice";
import { LoaderCircle } from "lucide-react";

const UpdateProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null; // 👈 FIXED

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.product);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
    }
  }, [product]);

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      updateProduct({
        productId: product.id,
        body: formData,
      })
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">

        <button onClick={onClose} className="absolute right-4 top-4 text-xl">
          ×
        </button>

        <h2 className="text-xl font-bold mb-4 text-center">Update Product</h2>

        {/* FORM */}
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />

          <input
            type="number"
            className="border p-2 rounded"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          />

          <select
            className="border p-2 rounded"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option>Electronics</option>
            <option>Fashion</option>
            <option>Home & Garden</option>
          </select>

          <textarea
            className="border p-2 rounded col-span-2"
            rows="4"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button className="col-span-2 bg-green-600 text-white py-2 rounded">
            {loading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductModal;
