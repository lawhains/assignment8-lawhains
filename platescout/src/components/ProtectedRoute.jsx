import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("User");
  if (!token || !user) {
    localStorage.removeItem("token");
    localStorage.removeItem("User");
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
