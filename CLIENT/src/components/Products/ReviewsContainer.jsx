import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//  Only one import — no duplicates
import { postReview, deleteReview } from "../../store/slices/productSlice";

import { Star } from "lucide-react";

const ReviewsContainer = ({ product, productReviews }) => {
  const { authUser } = useSelector((state) => state.auth);

  const { isReviewDeleting, isPostingReview } = useSelector(
    (state) => state.product
  );

  const dispatch = useDispatch();

  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("rating", rating);
    data.append("comment", comment);

    dispatch(postReview({ productId: product.id, review: data }));
  };

  return (
    <>
      {/*  REVIEW FORM — only when user is logged in */}
      {authUser && (
        <form onSubmit={handleReviewSubmit} className="mb-8 space-y-4">
          <h4 className="text-lg font-semibold">Leave a Review</h4>

          {/*  Rating Select */}
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className={`text-2xl ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ☆
              </button>
            ))}
          </div>

          {/*  Comment Box */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Write your review..."
            className="w-full p-3 rounded-md border border-border bg-background text-foreground"
          />

          {/*  Submit Review */}
          <button
            type="submit"
            disabled={isPostingReview}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:glow-on-hover disabled:opacity-50"
          >
            {isPostingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/*  All Reviews */}
      <h3 className="text-xl font-semibold text-foreground mb-6">
        Customer Reviews
      </h3>

      {productReviews && productReviews.length > 0 ? (
        <div className="space-y-6">
          {productReviews.map((review) => (
            <div key={review.review_id} className="glass-card p-6">
              <div className="flex items-center space-x-4">

                {/* Avatar */}
                <img
                  src={review.reviewer?.avatar?.url || "/avatar-holder.avif"}
                  alt={review?.reviewer?.name}
                  className="w-12 h-12 rounded-full"
                />

                <div className="flex-1">
                  {/* Name + Stars */}
                  <div className="flex items-center space-x-4 mb-2">
                    <h4 className="font-semibold">{review?.reviewer?.name}</h4>

                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground mb-2">
                    {review.comment}
                  </p>

                  {/*  Delete Review (Only Author can delete) */}
                  {authUser?.id === review.reviewer?.id && (
                    <button
                      onClick={() =>
                        dispatch(
                          deleteReview({
                            productId: product.id,
                            reviewId: review.review_id,
                          })
                        )
                      }
                      className="mt-4 px-4 py-2 glass-card text-red-500 hover:bg-red-500 hover:text-white rounded-lg"
                    >
                      {isReviewDeleting ? "Deleting..." : "Delete Review"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No reviews yet.</p>
      )}
    </>
  );
};

export default ReviewsContainer;
