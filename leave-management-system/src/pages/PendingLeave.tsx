import { useLeaves } from "../context/LeaveContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/DashboardLayout";
import PendingLeaveStatusTable from "../components/leave/PendingLeaveStatusTable";
import PendingLeaveStatusCard from "../components/leave/PendingLeaveStatusCard";
import { Clock } from "lucide-react";

const PendingLeave = () => {
  const { t } = useTranslation();
  const { leaves, approveLeave, rejectLeave, forwardLeave } = useLeaves();
  const { user } = useAuth();

  // Show pending and forwarded leaves assigned to current user
  const pendingLeaves = leaves.filter(
    (leave) =>
      (leave.status === "PENDING" || leave.status === "FORWARDED") &&
      leave.currentApproverId === user?.id &&
      leave.applicantId !== user?.id
  );

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen p-2 sm:p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#fff3e0] rounded-xl">
            <Clock className="text-[#FF9933]" size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a237e]">{t("pendingLeaves")}</h2>
            <p className="text-sm text-gray-500">{t("reviewPendingRequests")}</p>
          </div>
        </div>

        {pendingLeaves.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-[#e8eaf6] rounded-full flex items-center justify-center mb-4">
              <Clock className="text-[#1a237e]" size={32} />
            </div>
            <p className="text-gray-500 text-sm sm:text-base">{t("noPendingLeaves")}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
              <PendingLeaveStatusTable
                leaves={pendingLeaves}
                onApprove={approveLeave}
                onReject={(id) => rejectLeave(id, "No reason provided")}
                onForward={(id) => forwardLeave(id, "Forwarded to senior authority")}
              />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden">
              <PendingLeaveStatusCard
                leaves={pendingLeaves}
                onApprove={approveLeave}
                onReject={(id) => rejectLeave(id, "No reason provided")}
                onForward={(id) => forwardLeave(id, "Forwarded to senior authority")}
              />
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingLeave;