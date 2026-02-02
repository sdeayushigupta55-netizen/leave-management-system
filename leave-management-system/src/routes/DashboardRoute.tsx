import { useAuth } from "../context/AuthContext";
import ConstableDashboard from "../pages/constable/ConstableDashboard"
import HeadConstableDashboard from "../pages/headconstabledashboard/HeadConstableDashboard";
import InspectorDashboard from "../pages/Inspector/InspectorDashboard";
import SHODashboard from "../pages/SHO/SHODashboard";
import SIDashboard from "../pages/SI/SIDashboard";
// import SIDashboard from "../components/dashboard/SIDashboard";
// import InspectorDashboard from "../components/dashboard/InspectorDashboard";
// import SHODashboard from "../components/dashboard/SHODashboard";
// import SPDashboard from "../components/dashboard/SPDashboard";

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Unauthorized</div>;
  }

  switch (user.rank) {
    case "CONSTABLE":
      return <ConstableDashboard />;
    case "HEAD_CONSTABLE":
      return <HeadConstableDashboard />;
    case "SI":
      return <SIDashboard />;
    case "INSPECTOR":
      return <InspectorDashboard />;
    case "SHO":
      return <SHODashboard />;
    // case "SP":
    //   return <SPDashboard />;
    default:
      return <div>Unauthorized</div>;
  }
};

export default DashboardRouter;
