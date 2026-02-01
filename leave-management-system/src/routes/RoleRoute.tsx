import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import type { UserRole, PoliceRank } from "../type/user";

type RoleRouteProps = {
  allowRole: UserRole[];
  allowRank?: PoliceRank[];
  children: React.ReactNode;
};

const RoleRoute = ({ allowRole, allowRank, children }: RoleRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const hasRole = allowRole.includes(user.role);
  // const hasRank = allowRank ? allowRank.includes(user.rank) : true;
const hasRank = allowRank ? (user.rank !== undefined && allowRank.includes(user.rank)) : true;
  if (hasRole && hasRank) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
};

export default RoleRoute;




