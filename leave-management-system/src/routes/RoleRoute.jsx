import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ children, allow }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  if (!allow.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleRoute;
