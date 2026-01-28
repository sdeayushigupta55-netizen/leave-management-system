import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useLeave } from "../../context/LeaveContext";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";

const TOTAL_LEAVES = 24; // company policy

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { leaves } = useLeave();
  const { t } = useTranslation();

  // 🔹 Derived values (auto-update)
  const stats = useMemo(() => {
    const approved = leaves.filter(l => l.status === "APPROVED").length;
    const pending = leaves.filter(l => l.status === "PENDING").length;

    return {
      usedLeaves: approved,
      pendingRequests: pending,
      remainingLeaves: TOTAL_LEAVES - approved,
    };
  }, [leaves]);

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold mb-4">
        {t("employeeDashboard")}
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        {t("welcome")}, {user?.name}
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Total Leaves */}
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("totalLeaves")}</p>
          <p className="text-2xl font-bold">{TOTAL_LEAVES}</p>
        </div>

        {/* Used Leaves */}
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("usedLeaves")}</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.usedLeaves}
          </p>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("pendingRequests")}</p>
          <p className="text-2xl font-bold text-yellow-600">
            {stats.pendingRequests}
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
