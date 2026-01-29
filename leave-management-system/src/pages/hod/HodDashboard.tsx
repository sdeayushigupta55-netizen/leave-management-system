import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";


const HodDashboard = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{t("hodDashboard")}</h1>
          <p className="text-sm text-gray-600">
            {t("welcome")}, {user?.name}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("pendingApprovals")}</p>
          <p className="text-2xl font-bold text-yellow-600">3</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("approvedLeaves")}</p>
          <p className="text-2xl font-bold text-green-600">12</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">{t("rejectedLeaves")}</p>
          <p className="text-2xl font-bold text-red-600">1</p>
        </div>
      </div>

      

        
    
    </DashboardLayout>
  );
};

export default HodDashboard;
