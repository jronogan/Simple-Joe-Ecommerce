import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/Auth";
import "./Login.css";
import logo from "../assets/logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Login details
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/me");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      {/* Left Panel */}
      <div className="login-left">
        <div className="login-left-logo">
          <img src={logo} alt="Simple Joe logo" className="login-logo-img" />
          <div className="login-brand">
            <p className="login-brand-simple">Simple</p>
            <div className="login-brand-divider" />
            <h1 className="login-brand-name">Joe</h1>
          </div>
        </div>
        <p className="login-tagline">Orders made Simple</p>
        <div />
      </div>

      {/* Right Panel */}
      <div className="login-right">
        <div className="login-card">
          <img src={logo} alt="Simple Joe logo" className="login-logo-img" />
          <h2 className="login-title">Sign In</h2>
          <form className="login-form" onSubmit={handleLogin}>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="login-btn" type="submit">Login</button>
            {error && <p className="login-error">{error}</p>}
          </form>
          <p className="login-link">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
