import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LeaveProvider } from "./context/LeaveContext";
import RoleRoute from "./routes/RoleRoute";

import Login from "./pages/Login";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import SeniorDashboard from "./pages/senior/SeniorDashboard";
import HodDashboard from "./pages/hod/HodDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ApplyLeave from "./pages/employee/ApplyLeave";
import LeaveStatus from "./pages/employee/LeaveStatus";

import { ROLES } from "./constants/roles";
import HodLeaveApproval from "./pages/hod/HodLeaveApproval";

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
          <Route
            path="/hod/leave-approval"
            element={
              <RoleRoute allow={[ROLES.HOD]}>
                <HodLeaveApproval />
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
