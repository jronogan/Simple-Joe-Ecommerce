import { useLocation, Navigate, Link } from "react-router-dom";
import "./OrderSuccessful.css";

const OrderSuccessful = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/orders" replace />;

  const {
    orderNumber,
    status,
    paymentInfo,
    shippingAddress,
    items,
    priceBreakdown,
    createdAt,
  } = order;

  return (
    <div className="order-success-page">
      <div className="order-success-content">
        <h2 className="order-success-title">Order Placed!</h2>
        <div className="order-success-meta">
          <span>Order #{orderNumber}</span>
          <span>Status: {status}</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <div className="order-success-panels">
          {/* Left — Items */}
          <div className="order-success-items-panel">
            {items.map((item) => (
              <div key={item._id} className="order-success-item-card">
                <img
                  className="order-success-item-image"
                  src={item.image}
                  alt={item.name}
                />
                <div className="order-success-item-info">
                  <p className="order-success-item-name">{item.name}</p>
                  <p className="order-success-item-detail">Qty: {item.quantity}</p>
                  <p className="order-success-item-detail">${item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — Details */}
          <div className="order-success-details-panel">
            <div>
              <p className="order-success-section-title">Shipping Address</p>
              <div className="order-success-info-card">
                <p>{shippingAddress.addressLine1}</p>
                {shippingAddress.addressLine2 && <p>{shippingAddress.addressLine2}</p>}
                <p>
                  {shippingAddress.city}, {shippingAddress.state}{" "}
                  {shippingAddress.postalCode}
                </p>
                <p>{shippingAddress.country}</p>
              </div>
            </div>

            <div>
              <p className="order-success-section-title">Payment</p>
              <div className="order-success-info-card">
                <p><strong>Method:</strong> {paymentInfo.method}</p>
                <p><strong>Status:</strong> {order.paymentStatus}</p>
              </div>
            </div>

            <div>
              <p className="order-success-section-title">Price Breakdown</p>
              <div className="order-success-info-card">
                <p><strong>Subtotal:</strong> ${priceBreakdown.subtotal}</p>
                <p><strong>Tax:</strong> ${priceBreakdown.tax}</p>
                <p><strong>Shipping:</strong> ${priceBreakdown.shipping}</p>
                <p><strong>Total:</strong> ${priceBreakdown.total}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-success-footer">
          <Link to="/orders" className="order-success-btn">View Orders</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessful;
