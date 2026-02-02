import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LeaveProvider } from "./context/LeaveContext";
import RoleRoute from "./routes/RoleRoute";
import { UserProvider, useUsers } from "./context/UserContext";
import Login from "./pages/Login";
import EditProfile from "./pages/EditProfile";




import AdminDashboard from "./pages/admin/AdminDashboard";
import HeadConstableDashboard from "./pages/headconstabledashboard/HeadConstableDashboard";
import SI from "./pages/SI/SIDashboard"
import PendingLeave from "./pages/PendingLeave";
import ApplyLeave from "./pages/ApplyLeave";
import PoliceLeaveStatus from "./pages/PoliceLeaveStatus";


import AllUser from "./pages/admin/AllUser";
import DashboardRouter from "./routes/DashboardRoute";
import { POLICE_RANKS, SENIOR_RANKS } from "./constants/roles";
import type { ReactNode } from "react";
import SIDashboard from "./pages/SI/SIDashboard";
import InspectorDashboard from "./pages/Inspector/InspectorDashboard";
import SHODashboard from "./pages/SHO/SHODashboard";

function AuthProviderWithUser({ children }: { children: ReactNode }) {
  const { updateUser } = useUsers();
  return <AuthProvider updateUser={updateUser}>{children}</AuthProvider>;
}

function App() {
  return (
    <UserProvider>
      <AuthProviderWithUser>

        <LeaveProvider>

          <Routes>
            {/* Public */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Login />} />


            <Route path="/police">
              <Route path="edit-profile" element={<EditProfile />} />
              {/* Dashboard route varies per rank */}
              <Route
                index
                element={
                  <RoleRoute allowRole={["POLICE"]}>
                    <DashboardRouter /> {/* Component that renders correct dashboard based on rank */}
                  </RoleRoute>
                }
              />

              {/* Apply Leave - visible to all ranks */}
              <Route
                path="apply-leave"
                element={
                  <RoleRoute allowRole={["POLICE"]} allowRank={POLICE_RANKS}>
                    <ApplyLeave />
                  </RoleRoute>
                }
              />

              {/* Leave Status - visible to all ranks */}
              <Route
                path="leave-status"
                element={
                  <RoleRoute allowRole={["POLICE"]} allowRank={POLICE_RANKS}>
                    <PoliceLeaveStatus />
                  </RoleRoute>
                }
              />

              {/* Pending Leave - only senior ranks */}
              <Route
                path="pending-leave"
                element={
                  <RoleRoute allowRole={["POLICE"]} allowRank={SENIOR_RANKS}>
                    <PendingLeave />
                  </RoleRoute>
                }
              />
            </Route>


            {/* HEAD_CONSTABLE  */}
            <Route
              path="/headconstable"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["HEAD_CONSTABLE"]}>
                  <HeadConstableDashboard />
                </RoleRoute>
              }
            />

            {/* si */}
            <Route
              path="/si"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["SI"]}>
                  <SIDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="si/leave-approval"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["SI"]}>
                  <SIDashboard />
                </RoleRoute>
              }
            />

            {/* inspector */}
            <Route
              path="/inspector"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["INSPECTOR"]}>
                  <InspectorDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="inspector/leave-approval"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["INSPECTOR"]}>
                  <InspectorDashboard />
                </RoleRoute>
              }
            />
            {/* sho */}
            <Route
              path="/sho"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["SHO"]}>
                  <SHODashboard />
                </RoleRoute>
              }
            />
            <Route
              path="sho/leave-approval"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["SHO"]}>
                  <SHODashboard />
                </RoleRoute>
              }
            />
            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <RoleRoute allowRole={["ADMIN"]}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/all-users"
              element={
                <RoleRoute allowRole={["ADMIN"]}>
                  <AllUser />
                </RoleRoute>
              }
            />
          </Routes>
        </LeaveProvider>
      </AuthProviderWithUser >
    </UserProvider>


  );
}


export default App;
