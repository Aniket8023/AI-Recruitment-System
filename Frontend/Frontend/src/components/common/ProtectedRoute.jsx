import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="route-loader">
        <div className="loader-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "CANDIDATE") {
      return <Navigate to="/candidate/dashboard" replace />;
    }

    if (
      user.role === "RECRUITER" ||
      user.role === "COMPANY_ADMIN"
    ) {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    if (user.role === "ADMIN") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;