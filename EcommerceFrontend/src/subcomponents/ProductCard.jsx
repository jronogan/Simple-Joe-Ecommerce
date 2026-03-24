import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getOneProduct } from "../api/crud";
import AddToCartPortal from "./AddToCartPortal";
import "./ProductCard.css";

const ProductCard = () => {
  const { id } = useParams();
  const [showPortal, setShowPortal] = useState(false);

  const { data: singleProduct, isPending: singleProductPending } = useQuery({
    queryKey: ["products", id],
    queryFn: () => getOneProduct(id),
  });

  if (singleProductPending) return <div>Loading...</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-section">
        {/* Left: image + rating */}
        <div className="product-detail-left">
          <img
            className="product-detail-image"
            src={singleProduct.images}
            alt={singleProduct.name}
          />
          <p className="product-detail-rating">
            Rating: {singleProduct.averageRating} ⭐
          </p>
        </div>

        {/* Right: name, price, description, button */}
        <div className="product-detail-right">
          <h2 className="product-detail-name">{singleProduct.name}</h2>
          <p className="product-detail-price">Price: ${singleProduct.price}</p>
          <p className="product-detail-description">{singleProduct.description}</p>
          <button className="product-detail-btn" onClick={() => setShowPortal(true)}>
            Add to Cart
          </button>
        </div>
      </div>

      <div className="product-detail-reviews">
        <h3>Reviews</h3>
        {singleProduct.reviews.length > 0 ? (
          singleProduct.reviews.map((review) => (
            <div key={review} className="product-detail-review-item">
              <p>{review}</p>
            </div>
          ))
        ) : (
          <p className="product-detail-no-reviews">No reviews available.</p>
        )}
      </div>

      {showPortal && (
        <AddToCartPortal
          product={singleProduct}
          setSelectedProduct={setShowPortal}
        />
      )}
    </div>
  );
};

export default ProductCard;
