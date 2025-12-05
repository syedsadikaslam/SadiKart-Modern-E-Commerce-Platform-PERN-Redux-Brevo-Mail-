import React from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice"

const ProductCard = ({ product }) => {

  const dispatch = useDispatch();
  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
  };

  return <>

    <Link
      key={product.id}
      to={`/product/${product.id}`}
      className="glass-card hover:glow-on-hover animate-smooth group"
    >

      {/* PRODUCT IMAGE & QUICK ACTIONS */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img
          src={product.images[0].url}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* BADGES */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {/* NEW Badge: If product was created less than 30 days ago */}
          {new Date() - new Date(product.created_at) < 30 * 24 * 60 * 60 * 1000 && (
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
              NEW
            </span>
          )}
          {/* TOP RATED Badge: If ratings are 4 or higher */}
          {product.ratings >= 4 && (
            <span className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-rose-500 text-white bg-primary text-primary-foreground text-xs font-semibold rounded">
              TOP RATED
            </span>
          )}
        </div>

        {/* QUICK ADD TO CART BUTTON */}
        <button
          onClick={(e) => handleAddToCart(product, e)}
          disabled={product.stock === 0}
          className="absolute bottom-3 right-3 p-2 glass-card hover:glow-on-hover animate-smooth opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ShoppingCart className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* PRODUCT INFO */}
      <div className="p-4">
        {/* SHORT TITLE */}
        <h3 className="text-lg font-medium text-foreground truncate">
          {product.name}
        </h3>

        {/* PRODUCT RATINGS */}
        <div className="flex items-center space-x-2 mb-1">
          <div className="flex items-center">
            {/* Rendering 5 Star icons */}
            {[...Array(5)].map((_, i) => {
              return (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.ratings)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                    }`}
                />
              );
            })}
          </div>
          {/* Review Count */}
          <span className="text-sm text-muted-foreground">
            ({product.review_count})
          </span>
        </div>

        {/* PRODUCT PRICE */}
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">
            ₹{product.price}
          </span>
        </div>

        {/* PRODUCT AVAILABILITY / STOCK STATUS */}
        <div className="flex items-center mt-2">
          <span
            className={`text-xs px-2 py-1 rounded ${product.stock > 5
              ? "bg-green-500/20 text-green-400"
              : product.stock > 0
                ? "bg-yellow-500/20 text-yellow-600"
                : "bg-red-500/20 text-red-600"
              }`}
          >
            {product.stock > 5
              ? "In Stock"
              : product.stock > 0
                ? "Limited Stock"
                : "Out of Stock"}
          </span>
        </div>
      </div>
    </Link>

  </>;
};

export default ProductCard;
