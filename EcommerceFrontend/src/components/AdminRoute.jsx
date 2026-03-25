import { Navigate } from "react-router-dom";
import { useAuth } from "../authentication/Auth";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/products" replace />;

  return children;
};

export default AdminRoute;
