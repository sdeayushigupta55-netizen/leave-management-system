import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LeaveProvider } from "./context/LeaveContext";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/dashboard/EmployeeDashboard";
import SeniorDashboard from "./pages/dashboard/SeniorDashboard";
import HodDashboard from "./pages/dashboard/HodDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

import ApplyLeave from "./pages/ApplyLeave";
import LeaveStatus from "./pages/LeaveStatus";

import { ROLES } from "./constants/roles";

function App() {
  return (
    <AuthProvider>
      <LeaveProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          {/* JUNIOR / EMPLOYEE */}
          <Route
            path="/employee"
            element={
              <RoleRoute allow={[ROLES.JUNIOR]}>
                <EmployeeDashboard />
              </RoleRoute>
            }
          />
          <Route
            path="/employee/apply-leave"
            element={
              <RoleRoute allow={[ROLES.JUNIOR]}>
                <ApplyLeave />
              </RoleRoute>
            }
          />
          <Route
            path="/employee/leave-status"
            element={
              <RoleRoute allow={[ROLES.JUNIOR]}>
                <LeaveStatus />
              </RoleRoute>
            }
          />

          {/* SENIOR / APPROVER */}
          <Route
            path="/senior"
            element={
              <RoleRoute allow={[ROLES.SENIOR]}>
                <SeniorDashboard />
              </RoleRoute>
            }
          />

          {/* HOD */}
          <Route
            path="/hod"
            element={
              <RoleRoute allow={[ROLES.HOD]}>
                <HodDashboard />
              </RoleRoute>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <RoleRoute allow={[ROLES.ADMIN]}>
                <AdminDashboard />
              </RoleRoute>
            }
          />
        </Routes>
      </LeaveProvider>
    </AuthProvider>
  );
}

export default App;
