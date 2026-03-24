import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { createOrder, getCart, getUserAddress } from "../api/crud";
import { PAYMENT_METHODS } from "../api/constants";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState({
    addressId: "",
    paymentMethod: "",
    transactionId: "",
  });

  //   GET CART
  const { data: myCart, isPending: cartPending } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  //   GET USER ADDRESS
  const { data: userAddress, isPending: addressPending } = useQuery({
    queryKey: ["userAddress"],
    queryFn: getUserAddress,
  });

  //   CREATE ORDER
  const {
    mutate,
    isPending: orderPending,
    isError,
  } = useMutation({
    mutationFn: () =>
      createOrder({ ...orderDetails, transactionId: crypto.randomUUID() }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setOrderDetails({ addressId: "", paymentMethod: "", transactionId: "" });
      navigate("/order-success", { state: { order: data.order } });
    },
  });

  if (cartPending || addressPending) return <div>Loading...</div>;

  const cartItems = myCart?.cart.items || [];

  const handleCheckOut = () => mutate();

  return (
    <div className="checkout-page">
      <div className="checkout-content">
        <h2 className="checkout-title">Checkout</h2>

        <div className="checkout-panels">
          {/* Left — Order Summary */}
          <div className="checkout-summary-panel">
            {cartItems.map((item) => (
              <div key={item.product._id} className="checkout-item-card">
                <img
                  className="checkout-item-image"
                  src={item.product.images}
                  alt={item.product.name}
                />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.product.name}</p>
                  <p className="checkout-item-detail">Price: ${item.priceAtAdd}</p>
                  <p className="checkout-item-detail">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Shipping + Payment */}
          <div className="checkout-details-panel">
            <div>
              <p className="checkout-section-title">Shipping Address</p>
              {userAddress?.length === 0 ? (
                <p style={{ color: "#c8daea" }}>No addresses saved.</p>
              ) : (
                userAddress?.map((address) => (
                  <label key={address._id} className="checkout-address-option">
                    <input
                      type="radio"
                      name="addressId"
                      value={address._id}
                      checked={orderDetails.addressId === address._id}
                      onChange={(e) =>
                        setOrderDetails((prev) => ({ ...prev, addressId: e.target.value }))
                      }
                    />
                    <div className="checkout-address-card">
                      {address.addressLine1}
                      {address.addressLine2 && `, ${address.addressLine2}`},{" "}
                      {address.city}, {address.state} {address.postalCode},{" "}
                      {address.country}
                    </div>
                  </label>
                ))
              )}
            </div>

            <div>
              <p className="checkout-section-title">Payment Method</p>
              <div className="checkout-payment-row">
                <span className="checkout-payment-label">
                  {orderDetails.paymentMethod
                    ? PAYMENT_METHODS.find((m) => m.value === orderDetails.paymentMethod)?.label
                    : "Payment Method"}
                </span>
                <select
                  className="checkout-payment-select"
                  value={orderDetails.paymentMethod}
                  onChange={(e) =>
                    setOrderDetails((prev) => ({ ...prev, paymentMethod: e.target.value }))
                  }
                >
                  <option value="">Select Payment</option>
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-footer">
          <button className="checkout-place-btn" onClick={handleCheckOut} disabled={orderPending}>
            {orderPending ? "Processing..." : "Place Order"}
          </button>
        </div>
        {isError && <p className="checkout-error">Failed to place order. Please try again.</p>}
      </div>
    </div>
  );
};

export default Checkout;
