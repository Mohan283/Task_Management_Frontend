import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  return isLoggedIn ? children : <Navigate to="/admin-login" replace />;
};

export default ProtectedRoute;