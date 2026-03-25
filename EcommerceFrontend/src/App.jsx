import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Profile from "./components/Profile";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import Login from "./components/Login";
import Register from "./components/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import PublicRoute from "./components/PublicRoute";
import OrderList from "../adminPages/OrderList";
import CategoryList from "../adminPages/CategoryList";
import ProductPage from "../adminPages/ProductPage";
import ProductCard from "./subcomponents/ProductCard";
import Checkout from "./components/Checkout";
import OrderSuccessful from "./subcomponents/OrderSuccessful";
import NavigationBar from "./subcomponents/NavigationBar";

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/products" element={<Products />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success"
          element={
            <ProtectedRoute>
              <OrderSuccessful />
            </ProtectedRoute>
          }
        />
        <Route path="/products/:id" element={<ProductCard />} />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <OrderList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <CategoryList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <ProductPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
