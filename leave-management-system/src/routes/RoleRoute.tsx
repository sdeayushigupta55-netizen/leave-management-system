import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface RoleRouteProps {
  children: ReactNode;
  allow: string[];
}

const RoleRoute = ({ children, allow }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  if (!allow.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default RoleRoute;