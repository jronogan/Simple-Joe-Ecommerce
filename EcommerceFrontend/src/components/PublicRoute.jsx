import { Navigate } from "react-router-dom";
import { useAuth } from "../authentication/Auth";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (isAuthenticated) return <Navigate to="/products" replace />;

  return children;
};

export default PublicRoute;
