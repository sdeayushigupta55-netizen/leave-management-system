import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LeaveProvider } from "./context/LeaveContext";
import RoleRoute from "./routes/RoleRoute";
import { UserProvider, useUsers } from "./context/UserContext";
import Login from "./pages/Login";
import EditProfile from "./pages/EditProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HeadConstableDashboard from "./pages/headconstabledashboard/HeadConstableDashboard";
import PendingLeave from "./pages/PendingLeave";
import ApplyLeave from "./pages/ApplyLeave";
import PoliceLeaveStatus from "./pages/PoliceLeaveStatus";
import AllUser from "./pages/admin/AllUser";
import DashboardRouter from "./routes/DashboardRoute";
import { POLICE_RANKS, SENIOR_RANKS } from "./constants/roles";
import type { ReactNode } from "react";
import SIDashboard from "./pages/SI/SIDashboard";
import InspectorDashboard from "./pages/Inspector/InspectorDashboard";
import SHODashboard from "./pages/SHO/SHO-SODashboard";
import SeniorDetails from "./components/SeniorDetails/SeniorDetails";
import CODashboard from "./pages/co/CODashboard";
import Pdfviewer from "./components/Pdfviewer";


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
              <Route
                path="senior-details"
                element={
                  <RoleRoute allowRole={["POLICE"]} allowRank={POLICE_RANKS}>
                    <SeniorDetails/> 
                  </RoleRoute>
                }
              />

              {/* Pending Leave - only senior ranks */}
              <Route
                path="pending-leave"
                element={
                  <RoleRoute allowRole={["POLICE","ADMIN"]} allowRank={SENIOR_RANKS}>
                    <PendingLeave />
                  </RoleRoute>
                }
              />
            </Route>


            {/* HEADCONSTABLE  */}
            <Route
              path="/headconstable"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["HEADCONSTABLE"]}>
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
                <RoleRoute allowRole={["POLICE"]} allowRank={["SHO/SO"]}>
                  <SHODashboard />
                </RoleRoute>
              }
            />
            <Route
              path="sho/leave-approval"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["SHO/SO"]}>
                  <SHODashboard />
                </RoleRoute>
              }
            />
            {/* co */}
            <Route
              path="/co"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["CO"]}>
                  <CODashboard />
                </RoleRoute>
              }
            />
            <Route
              path="co/leave-approval"
              element={
                <RoleRoute allowRole={["POLICE"]} allowRank={["CO"]}>
                  <CODashboard />
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
          <Route
  path="/bns-2023"
  element={
    <RoleRoute allowRole={["ADMIN", "POLICE"]}>
      <Pdfviewer />
    </RoleRoute>
  }
/>
 
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center h-screen">
                  <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
                </div>
              }
            />
            
          </Routes>
        </LeaveProvider>
      </AuthProviderWithUser >
    </UserProvider>


  );
}


export default App;





