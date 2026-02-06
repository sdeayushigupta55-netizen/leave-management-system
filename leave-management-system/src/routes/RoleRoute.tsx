import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import type { UserRole, PoliceRank } from "../type/user";

type RoleRouteProps = {
  allowRole: UserRole[];
  allowRank?: PoliceRank[];
  children: React.ReactNode;
};

const RoleRoute = ({ allowRole, allowRank, children }: RoleRouteProps) => {
  const { user, isLoading } = useAuth();

  // Wait for auth to load before checking
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0d1b2a] to-[#1a237e]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

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




