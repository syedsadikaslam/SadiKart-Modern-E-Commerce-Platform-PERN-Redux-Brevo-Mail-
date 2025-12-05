import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "../store/slices/productsSlice";
import { toggleCreateProductModal } from "../store/slices/extraSlice";
import { LoaderCircle } from "lucide-react";

const CreateProductModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null; 

  const { loading } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Electronics",
    stock: "",
    images: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key !== "images") data.append(key, formData[key]);
    });

    formData.images.forEach((img) => data.append("images", img));

    dispatch(createProduct(data));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center">Create Product</h2>

        {/* FORM */}
        <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price"
            className="border p-2 rounded"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Stock"
            className="border p-2 rounded"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            required
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
            <option>Sports</option>
            <option>Books</option>
            <option>Beauty</option>
            <option>Automotive</option>
          </select>

          <input
            type="file"
            multiple
            className="col-span-2 border p-2 rounded"
            onChange={(e) =>
              setFormData({
                ...formData,
                images: Array.from(e.target.files),
              })
            }
          />

          <textarea
            placeholder="Description"
            className="col-span-2 border p-2 rounded"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="4"
          />

          <button className="col-span-2 bg-blue-600 text-white py-2 rounded">
            {loading ? "Creating..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
