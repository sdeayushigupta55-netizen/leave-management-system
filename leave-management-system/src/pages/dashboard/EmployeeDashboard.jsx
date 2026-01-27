import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("totalLeaves")}</p>
          <p className="text-2xl font-bold">24</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("usedLeaves")}</p>
          <p className="text-2xl font-bold text-red-600">6</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("pendingRequests")}</p>
          <p className="text-2xl font-bold text-yellow-600">2</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
