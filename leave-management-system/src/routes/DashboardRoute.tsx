import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CODashboard from "../pages/co/CODashboard";
import ConstableDashboard from "../pages/constable/ConstableDashboard"
import HeadConstableDashboard from "../pages/headconstabledashboard/HeadConstableDashboard";
import InspectorDashboard from "../pages/Inspector/InspectorDashboard";
import SHODashboard from "../pages/SHO/SHO-SODashboard";
import SIDashboard from "../pages/SI/SIDashboard";
import SPDashboard from "../pages/sp/SPDashboard";
// import SIDashboard from "../components/dashboard/SIDashboard";
// import InspectorDashboard from "../components/dashboard/InspectorDashboard";
// import SHODashboard from "../components/dashboard/SHODashboard";
// import SPDashboard from "../components/dashboard/SPDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  // Handle ADMIN role
  if (user.role === "ADMIN") {
    return <AdminDashboard />;
  }

  // Handle POLICE role based on rank
  switch (user.rank) {
    case "CONSTABLE":
      return <ConstableDashboard />;
    case "HEAD_CONSTABLE":
      return <HeadConstableDashboard />;
    case "SI":
      return <SIDashboard />;
    case "INSPECTOR":
      return <InspectorDashboard />;
    case "SHO/SO":
      return <SHODashboard />;
    case "SP":
      return <SPDashboard />;
    case "CO":
      return <CODashboard />;
    case "SSP":
      return <AdminDashboard />;
    default:
      return <div>Unauthorized</div>;
  }
};

export default DashboardRouter;
