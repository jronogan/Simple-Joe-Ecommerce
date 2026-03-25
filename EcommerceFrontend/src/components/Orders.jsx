import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "../api/crud";
import { NavLink } from "react-router-dom";
import { useAuth } from "../authentication/Auth";
import SearchBar from "../subcomponents/SearchBar";
import "./Orders.css";

const Orders = () => {
  const { user, logout } = useAuth();

  const { data, isPending, isError } = useQuery({
    queryKey: ["myOrders"],
    queryFn: getMyOrders,
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Failed to load orders.</div>;

  const orders = data?.orders || [];

  return (
    <div className="orders-page">
      <SearchBar />

      <div className="orders-content">
        <h1 className="orders-welcome">Welcome, {user?.name}!</h1>

        <div className="orders-panels">
          {/* Left panel */}
          <div className="orders-left-panel">
            <h2 className="orders-account-title">Account Home</h2>
            <NavLink to="/me" className="orders-nav-link">Profile</NavLink>
            <NavLink to="/cart" className="orders-nav-link">Cart</NavLink>
            <NavLink to="/orders" className="orders-nav-link">Orders</NavLink>
            <button className="orders-nav-logout" onClick={logout}>Logout</button>
          </div>

          {/* Right panel */}
          <div className="orders-right-panel">
            <h2 className="orders-panel-title">My Orders</h2>
            {orders.length === 0 ? (
              <p className="orders-empty">No orders yet.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="order-card">
                  <img
                    className="order-card-image"
                    src={order.items[0]?.image}
                    alt={order.items[0]?.name}
                  />
                  <div className="order-card-info">
                    <p>Order #: {order.orderNumber}</p>
                    <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Status: <span className={`order-status-badge order-status-${order.status}`}>{order.status}</span></p>
                    <p>Payment: {order.paymentStatus}</p>
                    <div className="order-card-items">
                      {order.items.map((item) => (
                        <p key={item._id} className="order-card-item">
                          {item.name} × {item.quantity} — ${item.price}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;
