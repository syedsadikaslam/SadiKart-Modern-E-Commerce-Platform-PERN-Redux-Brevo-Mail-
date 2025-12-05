import React, { useState } from "react";

const ViewProductModal = ({ isOpen, onClose, product }) => {
  if (!isOpen || !product) return null;

  const [mainImage, setMainImage] = useState(
    product.images?.[0]?.url || "/placeholder.jpg"
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative shadow-xl max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 border-b pb-3">
          {product.name}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* LEFT SIDE: IMAGES */}
          <div>
            {/* Main Image */}
            <img
              src={mainImage}
              className="w-full h-64 object-cover rounded-lg shadow-md border"
              alt="Product Preview"
            />

            {/* Thumbnails */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {product.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt=""
                  className={`w-20 h-20 object-cover rounded-lg border cursor-pointer transition-all ${
                    mainImage === img.url
                      ? "border-blue-600 scale-105"
                      : "border-gray-300"
                  }`}
                  onClick={() => setMainImage(img.url)}
                />
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: DETAILS */}
          <div className="space-y-3">

            <p className="text-lg">
              <span className="font-semibold text-gray-700">Category:</span>{" "}
              {product.category}
            </p>

            <p className="text-lg">
              <span className="font-semibold text-gray-700">Price:</span>{" "}
              <span className="text-green-600 font-bold text-xl">
                ₹{product.price}
              </span>
            </p>

            <p className="text-lg">
              <span className="font-semibold text-gray-700">Stock:</span>{" "}
              {product.stock}
            </p>

            <p className="text-lg">
              <span className="font-semibold text-gray-700">Ratings:</span>{" "}
              ⭐ {product.ratings || 0}
            </p>

            <p className="text-lg leading-relaxed">
              <span className="font-semibold text-gray-700">Description:</span>
              <br />
              <span className="text-gray-600">{product.description}</span>
            </p>

            <p className="text-sm text-gray-500 mt-4">
              Created On:{" "}
              {new Date(product.created_at).toLocaleDateString()}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
