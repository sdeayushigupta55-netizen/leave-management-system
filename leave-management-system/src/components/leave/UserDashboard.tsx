import { useAuth } from "../../context/AuthContext";
import { useLeave } from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LeaveStatusTable from "../../components/leave/LeaveStatusTable";
import Button from "../../ui/Button";
import StatCard from "../../ui/StatCard";
import { BarChart3, Clock, FileText, CheckCircle } from "lucide-react";

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { leaves } = useLeave();
  const navigate = useNavigate();

  if (!user) return null;

  const myLeaves = leaves.filter((leave) => leave.applicantId === user.id);

  const approvalStats = {
    pending: leaves.filter(
      (leave) =>
        leave.currentApproverId === user.id &&
        leave.status === "PENDING" &&
        leave.applicantId !== user.id
    ).length,
    approved: leaves.filter((leave) =>
      leave.approvals.some((a) => a.approverId === user.id && a.action === "APPROVED")
    ).length,
    rejected: leaves.filter((leave) =>
      leave.approvals.some((a) => a.approverId === user.id && a.action === "REJECTED")
    ).length,
    forwarded: leaves.filter((leave) =>
      leave.approvals.some((a) => a.approverId === user.id && a.action === "FORWARDED")
    ).length,
  };

  const stats = {
    pending: myLeaves.filter((l) => l.status === "PENDING").length,
    approved: myLeaves.filter((l) => l.status === "APPROVED").length,
    rejected: myLeaves.filter((l) => l.status === "REJECTED").length,
    forwarded: myLeaves.filter((l) => l.status === "FORWARDED").length,
    draft: myLeaves.filter((l) => l.status === "DRAFT").length,
  };

  const recentLeaves = [...myLeaves].slice(0, 5);

  const isJuniorRank =
    user.rank === "CONSTABLE" ||
    user.rank === "HEAD_CONSTABLE" ||
    user.rank === "SI" ||
    user.rank === "INSPECTOR";

  const isSeniorRank =
    user.rank === "SHO/SO" || user.rank === "CO" || user.rank === "SP" || user.rank === "SSP";

  // Only SHO/SO, CO, SP can forward leaves (SSP is final authority, cannot forward)
  const canForward = user.rank === "SHO/SO" || user.rank === "CO" || user.rank === "SP";

  return (
    <div className="w-full min-h-screen p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 flex flex-col">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2 sm:gap-x-4 sm:gap-y-2 text-sm">
          <h1 className="font-bold text-[#1a237e] text-lg sm:text-xl">
            {t("welcome")}, {user.name}
          </h1>

          <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-gradient-to-r from-[#1a237e] to-[#303f9f] text-white text-xs font-semibold shadow-sm">
            {user.rank}
          </span>

          <div className="flex flex-wrap gap-2 sm:gap-x-4 text-gray-600 text-xs sm:text-sm">
            <span className="bg-gray-50 px-2 py-1 rounded-lg">🆔 {user.uno}</span>
            {(user.rank === "SP" || user.rank === "CO" || isJuniorRank) && user.area && (
              <span className="bg-gray-50 px-2 py-1 rounded-lg">📍 {user.area}</span>
            )}
            {(user.rank === "SHO/SO" || isJuniorRank) && user.policeStation && (
              <span className="bg-gray-50 px-2 py-1 rounded-lg">🏛️ {user.policeStation}</span>
            )}
            {(user.rank === "SHO/SO" || user.rank === "CO" || isJuniorRank) && user.circleOffice && (
              <span className="bg-gray-50 px-2 py-1 rounded-lg">🏢 {user.circleOffice}</span>
            )}
          </div>

          <span
            className={`self-start sm:self-auto sm:ml-auto text-xs font-semibold px-3 py-1 rounded-full shadow-sm ${
              user.isActive ? "bg-[#e8f5e9] text-[#138808]" : "bg-[#ffebee] text-[#c62828]"
            }`}
          >
            {user.isActive ? t("active") : t("inactive")}
          </span>
        </div>
      </div>

      {/* My Leave Stats */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#e8eaf6] rounded-xl">
            <BarChart3 className="text-[#1a237e]" size={22} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1a237e]">{t("myLeaveOverview")}</h2>
            <p className="text-sm text-gray-500">{t("yourLeaveStats")}</p>
          </div>
        </div>
        <div className={`grid grid-cols-2 ${isJuniorRank ? 'sm:grid-cols-4' : 'sm:grid-cols-4'} gap-3 sm:gap-4`}>
          <StatCard title={t("pending")} value={stats.pending} color="pending" />
          <StatCard title={t("approved")} value={stats.approved} color="approved" />
          <StatCard title={t("rejected")} value={stats.rejected} color="rejected" />
          {/* {!isJuniorRank && (
            <StatCard title={t("forwarded")} value={stats.forwarded} color="forwarded" />
          )} */}
          <StatCard title={t("draft")} value={stats.draft} color="draft" />
        </div>
      </section>

      {/* Approval Stats for Senior Ranks */}
      {user.role === "POLICE" && isSeniorRank && (
        <section className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#fff8e1] rounded-xl">
              <CheckCircle className="text-[#FF9933]" size={22} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1a237e]">{t("leaveApprovalOverview")}</h2>
              <p className="text-sm text-gray-500">{t("requestsPendingApproval")}</p>
            </div>
          </div>
          <div className={`grid grid-cols-2 ${canForward ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3 sm:gap-4`}>
            <StatCard title={t("pending")} value={approvalStats.pending} color="pending" />
            <StatCard title={t("approved")} value={approvalStats.approved} color="approved" />
            <StatCard title={t("rejected")} value={approvalStats.rejected} color="rejected" />
            {canForward && (
              <StatCard title={t("forwarded")} value={approvalStats.forwarded} color="forwarded" />
            )}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <Button
          variant="primary"
          onClick={() => navigate("/police/apply-leave")}
          className="w-full sm:w-auto"
        >
          {t("applyLeave")}
        </Button>
        <Button
          onClick={() => navigate("/police/leave-status")}
          variant="white"
          className="w-full sm:w-auto"
        >
          {t("viewLeaveStatus")}
        </Button>
      </div>

      {/* Recent Leaves */}
      <section className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#e8eaf6] rounded-xl">
            <Clock className="text-[#1a237e]" size={22} />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a237e]">{t("recentLeaveRequests")}</h3>
            <p className="text-sm text-gray-500">{t("yourLatestApplications")}</p>
          </div>
        </div>

        {recentLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <FileText size={48} className="mb-2 opacity-50" />
            <p className="text-sm">{t("noLeaveRecords")}</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <LeaveStatusTable
                leaves={recentLeaves}
                onEdit={(leaveId) => navigate("/police/apply-leave", { state: { leaveId } })}
              />
            </div>

            <div className="md:hidden space-y-3">
              {recentLeaves.map((leave) => (
                <div key={leave.id} className="border border-gray-100 rounded-xl p-4 bg-gradient-to-r from-gray-50 to-white hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-[#1a237e] text-sm">{leave.leaveType}</span>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        leave.status === "APPROVED"
                          ? "bg-[#e8f5e9] text-[#138808]"
                          : leave.status === "REJECTED"
                          ? "bg-[#ffebee] text-[#c62828]"
                          : leave.status === "PENDING"
                          ? "bg-[#fff8e1] text-[#f57c00]"
                          : leave.status === "FORWARDED"
                          ? "bg-[#efebe9] text-[#6d4c41]"
                          : "bg-[#e8eaf6] text-[#1a237e]"
                      }`}
                    >
                      {t(leave.status.toLowerCase())}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1.5">
                    <p>
                      📅 {leave.from} {leave.from !== leave.to && `- ${leave.to}`}
                    </p>
                    <p>📝 {leave.reason}</p>
                    {leave.currentApproverName && (
                      <p>
                        👤 {t("assignedTo")}: <span className="font-semibold text-[#1a237e]">{leave.currentApproverName}</span>
                        {leave.currentApproverRank && <span className="text-gray-400"> ({leave.currentApproverRank})</span>}
                      </p>
                    )}
                    {/* Show forward history */}
                    {leave.forwardHistory && leave.forwardHistory.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="font-semibold text-[#8d6e63] mb-1">➡️ {t("forwardHistory") || "Forward History"}:</p>
                        {leave.forwardHistory.map((fh, idx) => (
                          <p key={idx} className="text-[10px] text-gray-500">
                            {fh.fromRank} → {fh.toRank}: {fh.reason}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  {leave.status === "DRAFT" && (
                    <button
                      onClick={() => navigate("/police/apply-leave", { state: { leaveId: leave.id } })}
                      className="mt-3 text-xs text-[#1a237e] font-semibold hover:text-[#303f9f] transition-colors"
                    >
                      {t("edit")} →
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default UserDashboard;