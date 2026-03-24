import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, NavLink } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem } from "../api/crud";
import { useAuth } from "../authentication/Auth";
import SearchBar from "../subcomponents/SearchBar";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();
  const { data: myCart, isPending: myCartPending } = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
  });

  const { mutate: updateItem } = useMutation({
    mutationFn: ({ productId, quantity }) =>
      updateCartItem({ productId, quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const { mutate: removeItem } = useMutation({
    mutationFn: (productId) => removeCartItem(productId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  if (myCartPending) return <div>Loading...</div>;

  const cartItems = myCart?.cart.items || [];
  const cartTotalPrice = myCart?.cart.totalPrice || 0;

  return (
    <div className="cart-page">
      <SearchBar />

      <div className="cart-content">
        <h1 className="cart-welcome">Welcome, {user?.name}!</h1>

        <div className="cart-panels">
          {/* Left panel */}
          <div className="cart-left-panel">
            <h2 className="cart-account-title">Account Home</h2>
            <NavLink to="/me" className="cart-nav-link">
              Profile
            </NavLink>
            <NavLink to="/cart" className="cart-nav-link">
              Cart
            </NavLink>
            <NavLink to="/orders" className="cart-nav-link">
              Orders
            </NavLink>
            <button className="cart-nav-logout" onClick={logout}>
              Logout
            </button>
          </div>

          {/* Right panel */}
          <div className="cart-right-panel">
            <h2 className="cart-panel-title">My Cart</h2>

            {cartItems.length === 0 ? (
              <p className="cart-empty">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.product._id} className="cart-item-card">
                  <img
                    className="cart-item-image"
                    src={item.product.images}
                    alt={item.product.name}
                  />
                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.product.name}</p>
                    <p className="cart-item-detail">
                      Price: ${item.priceAtAdd}
                    </p>
                    <div className="cart-item-controls">
                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          updateItem({
                            productId: item.product._id,
                            quantity: item.quantity - 1,
                          })
                        }
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="cart-qty-value">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          updateItem({
                            productId: item.product._id,
                            quantity: item.quantity + 1,
                          })
                        }
                      >
                        +
                      </button>
                      <button
                        className="cart-remove-btn"
                        onClick={() => removeItem(item.product._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="cart-footer">
              <p className="cart-total">TOTAL: ${cartTotalPrice}</p>
              <div className="cart-actions">
                <button
                  className="cart-btn cart-btn-filled"
                  onClick={() => navigate("/checkout")}
                >
                  Checkout
                </button>
                <button
                  className="cart-btn cart-btn-outline"
                  onClick={() => navigate("/products")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
