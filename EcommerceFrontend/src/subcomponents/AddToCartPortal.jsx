import { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCart } from "../api/crud";
import "./AddToCartPortal.css";

const AddToCartPortal = ({ product, setSelectedProduct }) => {
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () => addToCart({ productId: product._id, quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setSelectedProduct(null);
    },
  });

  return createPortal(
    <div className="portal-overlay" onClick={() => setSelectedProduct(null)}>
      <div className="portal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="portal-body">
          <img
            src={product.images}
            alt={product.name}
            className="portal-product-image"
          />
          <div className="portal-product-details">
            <p className="portal-product-name">{product.name}</p>
            <p className="portal-product-price">${product.price}</p>
            <div className="portal-qty-row">
              <span className="portal-qty-label">Quantity</span>
              <div className="portal-qty-controls">
                <button
                  className="portal-qty-btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="portal-qty-value">{quantity}</span>
                <button
                  className="portal-qty-btn"
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        {isError && <p className="portal-error">Failed to add to cart.</p>}
        <div className="portal-actions">
          <button
            className="portal-btn portal-btn-outline"
            onClick={() => setSelectedProduct(null)}
          >
            Cancel
          </button>
          <button
            className="portal-btn portal-btn-filled"
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("portal"),
  );
};

export default AddToCartPortal;
