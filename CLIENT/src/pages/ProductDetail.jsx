import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Plus,
  Minus,
  Loader,
  Zap,

} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import ReviewsContainer from "../components/Products/ReviewsContainer";
import { addToCart } from "../store/slices/cartSlice";
import { fetchProductDetails } from "../store/slices/productSlice";
import { useNavigate } from "react-router-dom";


const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { productDetails: product, loading, productReviews } = useSelector(
    (state) => state.product
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareText, setShareText] = useState("Share");
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
    navigate("/cart");
  };


  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ product, quantity }));
  };

  const handleShare = async () => {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: "Check this product",
          url,
        });
      } catch {
        /* user cancelled */
      }
    } else {
      navigator.clipboard.writeText(url);
      setShareText("Copied!");
      setTimeout(() => setShareText("Share"), 1200);
    }
  };

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [dispatch, id]);

  // Auto-open review tab when URL contains #reviews
  useEffect(() => {
    if (window.location.hash === "#reviews") {
      setActiveTab("reviews");

      setTimeout(() => {
        const section = document.getElementById("review-section");
        section?.scrollIntoView({ behavior: "smooth" });
      }, 400);
    }
  }, []);

  //  Product Not Found 
  if (!product && !loading) {
    return (
      <div className="h-screen flex items-center justify-center dark:bg-black">
        <h1 className="text-2xl font-bold text-black dark:text-white">
          Product Not Found
        </h1>
      </div>
    );
  }

  //  Loading 
  if (loading || !product) {
    return (
      <div className="h-screen flex items-center justify-center dark:bg-black">
        <Loader className="w-10 h-10 animate-spin text-black dark:text-white" />
      </div>
    );
  }

  //  MAIN UI 
  return (
    <>
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-20">

        {/* HEADER */}
        <div className="fixed top-0 left-0 w-full 
        bg-white/80 dark:bg-black/70 backdrop-blur 
        z-40 flex justify-between px-4 py-3 shadow-sm 
        border-b border-gray-200 dark:border-gray-800 lg:hidden"
        >
          <span className="font-semibold text-lg">Product Details</span>

          <div className="flex gap-5">
            <Heart
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-6 h-6 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700 dark:text-gray-300"
                }`}
            />
            <Share2
              onClick={handleShare}
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        {/* IMAGES */}
        <div className="pt-16 relative">
          <img
            src={product.images?.[selectedImage]?.url}
            alt={product.name}
            className="w-full h-[350px] object-contain bg-gray-100 dark:bg-gray-900"
          />

          <div className="flex gap-2 overflow-x-auto mt-3 px-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                alt="preview"
                src={img.url}
                onClick={() => setSelectedImage(i)}
                className={`w-20 h-20 rounded border cursor-pointer ${selectedImage === i
                  ? "border-primary"
                  : "border-gray-300 dark:border-gray-700"
                  }`}
              />
            ))}
          </div>

        </div>

        {/* TITLE */}
        <div className="px-4 mt-4">
          <h1 className="text-xl font-semibold">{product.name}</h1>

          <div className="flex items-center gap-2 mt-2">
            <span className="bg-green-600 text-white px-2 py-0.5 
            text-xs rounded flex items-center gap-1"
            >
              {product.ratings}
              <Star className="w-3 h-3 fill-white" />
            </span>

            <span className="text-sm text-gray-500 dark:text-gray-300">
              <span className="text-gray-700 font-bold"> {productReviews?.length} </span> Reviews
            </span>
          </div>
        </div>

        {/* PRICE */}
        <div className="px-4 mt-4">
          <span className="text-3xl font-bold">₹{product.price}</span>
          <p className="text-green-600 dark:text-green-400 font-semibold text-sm mt-1">
            Special Price
          </p>
        </div>

        {/* QUANTITY + WISHLIST + SHARE */}
        <div className="px-4 mt-6">

          <h2 className="font-semibold mb-2">Quantity</h2>

          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-10 h-10 border dark:border-gray-700 rounded-full 
                       flex justify-center items-center"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-10 text-center text-lg font-semibold">{quantity}</span>

            <button
              onClick={() =>
                setQuantity((prev) =>
                  product.stock ? Math.min(product.stock, prev + 1) : prev + 1
                )
              }
              className="w-10 h-10 border dark:border-gray-700 rounded-full 
                       flex justify-center items-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Wishlist + Share */}
          <div className="flex gap-6 mt-4">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
            >
              <Heart
                className={`w-5 h-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""
                  }`}
              />
              <span>Add to Wishlist</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300"
            >
              <Share2 className="w-5 h-5" />
              <span>{shareText}</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="px-4 mt-6">
          <div className="flex border-b border-gray-300 dark:border-gray-700">
            {["description", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-4 font-medium ${activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 dark:text-gray-300"
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="py-4">
            {activeTab === "description" && (
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description}
              </p>
            )}

            {activeTab === "reviews" && (
              <ReviewsContainer
                product={product}
                productReviews={productReviews}
              />
            )}
          </div>
        </div>

        {/* STICKY BOTTOM BAR */}
        <div
          className="fixed bottom-0 left-0 w-full flex z-50 
                  bg-white dark:bg-gray-900 
                  shadow-lg border-t border-gray-200 dark:border-gray-700"
        >
          <button
            onClick={handleAddToCart}
            className="w-1/2 py-4 flex items-center justify-center gap-2
             bg-orange-500 text-white font-semibold 
             dark:bg-orange-600
             transition-all duration-150
             active:scale-95 active:brightness-90"
          >
            <ShoppingCart className="w-5 h-5" />
            ADD TO CART
          </button>

          <button
            onClick={handleBuyNow}
            className="w-1/2 py-4 flex items-center justify-center gap-2
             bg-primary text-white font-semibold 
             dark:bg-blue-500 dark:text-white
             transition-all duration-150
             active:scale-95 active:brightness-90"
          >
            <Zap className="w-5 h-5" />
            BUY NOW
          </button>

        </div>
      </div>
    </>
  );
};

export default ProductDetail;
