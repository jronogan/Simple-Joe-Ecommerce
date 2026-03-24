import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../authentication/Auth";
import { createAddress } from "../api/crud";
import AddressForm from "../subcomponents/AddressForm";
import "./Register.css";
import logo from "../assets/logo.svg";

const STEPS = {
  DETAILS: 1,
  ADDRESS: 2,
};

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState("");

  // User Registration Details
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User Address
  const [address, setAddress] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Register Page 2-step
  const [step, setStep] = useState(STEPS.DETAILS);

  const handleAddress = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Register User
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      await createAddress(address);
      setError("");
      navigate("/me");
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStep = () => {
    switch (step) {
      case STEPS.DETAILS:
        return (
          <>
            <p className="register-step-title">Your Details</p>
            <input
              className="register-input"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="register-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="register-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button className="register-btn" type="button" onClick={() => setStep(STEPS.ADDRESS)}>
              Next
            </button>
          </>
        );
      case STEPS.ADDRESS:
        return (
          <>
            <p className="register-step-title">Your Address</p>
            <AddressForm address={address} onChange={handleAddress} />
            <button className="register-btn" type="submit">
              Register
            </button>
            <button className="register-btn register-btn-outline" type="button" onClick={() => setStep(STEPS.DETAILS)}>
              Back
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="register-page">
      {/* Left Panel */}
      <div className="register-left">
        <div className="register-left-logo">
          <img src={logo} alt="Simple Joe logo" className="register-logo-img" />
          <div className="register-brand">
            <p className="register-brand-simple">Simple</p>
            <div className="register-brand-divider" />
            <h1 className="register-brand-name">Joe</h1>
          </div>
        </div>
        <p className="register-tagline">Orders made Simple</p>
        <div />
      </div>

      {/* Right Panel */}
      <div className="register-right">
        <div className="register-card">
          <div className="register-card-logo">
            <img src={logo} alt="Simple Joe logo" className="register-logo-img" />
          </div>
          <h2 className="register-title">Sign Up</h2>
          <form className="register-form" onSubmit={handleRegister}>
            {renderStep()}
            {error && <p className="register-error">{error}</p>}
          </form>
          <p className="register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
