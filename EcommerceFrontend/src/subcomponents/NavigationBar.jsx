import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../authentication/Auth";
import "./NavigationBar.css";
import logo from "../assets/logo.svg";

const NavigationBar = () => {
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="navbar">
      <NavLink to="/products" className="navbar-brand">
        <img src={logo} alt="Simple Joe logo" className="navbar-logo" />
        <span className="navbar-brand-name">Simple Joe</span>
      </NavLink>
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <NavLink to="/me" className="navbar-link">Profile</NavLink>
            <NavLink to="/cart" className="navbar-link">Cart</NavLink>
            <NavLink to="/orders" className="navbar-link">Orders</NavLink>
            <button className="navbar-logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="navbar-link">Login</NavLink>
            <NavLink to="/register" className="navbar-link">Register</NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
