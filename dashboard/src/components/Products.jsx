import React, { useEffect, useState, useMemo } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import CreateProductModal from "../modals/CreateProductModal.jsx";
import UpdateProductModal from "../modals/UpdateProductModal.jsx";
import ViewProductModal from "../modals/ViewProductModal.jsx";

import { getProducts, deleteProduct } from "../store/slices/productsSlice.js";
import { ToastContainer } from "react-toastify";

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.product);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const limit = 10;

  const query = useMemo(() => {
    const q = { page };
    if (search) q.search = search;
    return q;
  }, [page, search]);

  useEffect(() => {
    dispatch(getProducts(query));
  }, [dispatch, query]);

  const onDelete = (id) => {
    if (window.confirm("Delete product?")) {
      dispatch(deleteProduct(id));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="p-2 pt-10">
        {/* Top Row */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Products</h2>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Search Bar */}
        <input
          className="border p-3 rounded-lg mb-6 w-full shadow-sm"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center mt-10">
            <LoaderCircle className="animate-spin" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col h-[420px]"
              >
                {/* Image */}
                <div className="h-52 w-full bg-gray-100 flex justify-center items-center overflow-hidden">
                  {product.images?.length ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 p-4 flex flex-col">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                    {product.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {product.description}
                  </p>

                  <p className="text-blue-600 font-extrabold text-lg mb-3">
                    ₹{product.price}
                  </p>

                  {/* Buttons - Always at Bottom */}
                  <div className="mt-auto flex justify-between gap-2">
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsViewOpen(true);
                      }}
                      className="w-full py-2 rounded-md text-sm font-semibold bg-gray-200 hover:bg-gray-300 transition"
                    >
                      View
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsUpdateOpen(true);
                      }}
                      className="w-full py-2 rounded-md text-sm font-semibold bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => onDelete(product.id)}
                      className="w-full py-2 rounded-md text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
          >
            Prev
          </button>

          <span className="font-semibold">Page {page}</span>

          <button
            disabled={products.length < limit}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateProductModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <UpdateProductModal
        isOpen={isUpdateOpen}
        onClose={() => setIsUpdateOpen(false)}
        product={selectedProduct}
      />

      <ViewProductModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default Products;
