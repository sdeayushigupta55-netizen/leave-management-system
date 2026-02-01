import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LeaveProvider } from "./context/LeaveContext";
import RoleRoute from "./routes/RoleRoute";
import { UserProvider, useUsers } from "./context/UserContext";
import Login from "./pages/Login";
import EditProfile from "./pages/EditProfile";

import HeadConstableDashboard from "./pages/headconstabledashboard/HeadConstableDashboard";
import PendingLeave from "./pages/PendingLeave";


import HodDashboard from "./pages/hod/HodDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ApplyLeave from "./pages/ApplyLeave";
import PoliceLeaveStatus from "./pages/PoliceLeaveStatus";

// import LeaveStatus from "./pages/employee/LeaveStatus";
import HodLeaveApproval from "./pages/hod/HodLeaveApproval";
import AllUser from "./pages/admin/AllUser";
import DashboardRouter from "./routes/DashboardRoute";
import { POLICE_RANKS, SENIOR_RANKS } from "./constants/roles";
import type { ReactNode } from "react";

function AuthProviderWithUser({ children }: { children: ReactNode }){
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


            {/* SENIOR / APPROVER */}
            <Route
              path="/headconstable"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["HEAD_CONSTABLE"]}>
                  <HeadConstableDashboard />
                </RoleRoute>
              }
            />

            {/* HOD */}
            <Route
              path="/hod"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["SI"]}>
                  <HodDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/hod/leave-approval"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["SI"]}>
                  <HodLeaveApproval />
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
