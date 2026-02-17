import { useAuth } from "../../context/AuthContext";
import { useLeaves } from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LeaveStatusTable from "../../components/leave/LeaveStatusTable";
import Button from "../../ui/Button";
import StatCard from "../../ui/StatCard";
import {
  BarChart3,
  Clock,
  CheckCircle,
  
  FileText,
} from "lucide-react";

const UserDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { leaves } = useLeaves();
  const navigate = useNavigate();

  if (!user) return null;

  const myLeaves = leaves.filter((l) => l.applicantId === user.id);

  // ================= LEAVE STATUS STATS =================
  const stats = {
    pending: myLeaves.filter((l) => l.status === "PENDING").length,
    approved: myLeaves.filter((l) => l.status === "APPROVED").length,
    rejected: myLeaves.filter((l) => l.status === "REJECTED").length,
    draft: myLeaves.filter((l) => l.status === "DRAFT").length,
  };

  // ================= APPROVAL STATS =================
  const approvalStats = {
    pending: leaves.filter(
      (l) =>
        l.currentApproverId === user.id &&
        l.status === "PENDING" &&
        l.applicantId !== user.id
    ).length,
    approved: leaves.filter((l) =>
      l.approvals.some(
        (a) => a.approverId === user.id && a.action === "APPROVED"
      )
    ).length,
    rejected: leaves.filter((l) =>
      l.approvals.some(
        (a) => a.approverId === user.id && a.action === "REJECTED"
      )
    ).length,
  };

  const recentLeaves = myLeaves.slice(0, 5);

  const isSenior =
    ["SHO/SO", "CO", "SP", "SSP"].includes(user.rank ?? "CONSTABLE");

const myRecentApprovedLeaves = leaves
  .filter(
    (l) =>
      l.approvals.some(
        (a) => a.approverId === user.id && a.action === "APPROVED"
      )
  )
  .sort((a, b) => new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime())
  .slice(0, 5);

  // ================= LEAVE BALANCE CALCULATION =================

  // 🔹 Define Leave Limits (You can move this to config later)
  const leaveLimits = {
    CASUAL: 30,
    EARNED: 116,
  };

  // Only count APPROVED leaves as used
  const approvedLeaves = myLeaves.filter(
    (l) => l.status === "APPROVED"
  );

  const leaveUsage = {
    CASUAL: approvedLeaves.filter((l) => l.type === "CASUAL").length,
    EARNED: approvedLeaves.filter((l) => l.type === "EARNED").length,
  };

  return (
    <div className="space-y-6">

      {/* ================= PROFILE HEADER ================= */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="space-y-2">
           <h1 className="text-2xl font-bold text-[#1a237e] flex items-center gap-2">
  {t("welcome")}
  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-[#1a237e] to-[#303f9f] text-white text-sm font-semibold">
    {user.rank}
  </span>
  <span className="text-2xl font-bold text-[#f57c00]">
    {user.name
      .split(' ')
      .map(
        (part) =>
          part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join(' ')}
  </span>
</h1>
             

            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
               <span className="font-bold">PNO:</span> {user.pno}
              </span>
              {user.area && (
                <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                 <span className="font-bold">Area:</span> {user.area}
                </span>
              )}

              {user.circleOffice && (
                <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                  <span className="font-bold">Circle Office:</span> {user.circleOffice}
                </span>
              )}

              {user.policeStation && (
                <span className="flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-lg">
                 <span className="font-bold">Police Station:</span> {user.policeStation}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
          

            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${user.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                }`}
            >
              {user.isActive ? t("active") : t("inactive")}
            </span>
          </div>
        </div>
      </section>
      {/* ================= LEAVE BALANCE ================= */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1a237e] mb-5">
          Leave Balance
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Casual Leave */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h3 className="font-semibold text-[#1a237e] mb-2">
              Casual Leave
            </h3>
            <p className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-bold">
                {leaveLimits.CASUAL}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Used:{" "}
              <span className="font-bold text-red-600">
                {leaveUsage.CASUAL}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Remaining:{" "}
              <span className="font-bold text-green-600">
                {leaveLimits.CASUAL - leaveUsage.CASUAL}
              </span>
            </p>

          </div>

          {/* Earned Leave */}
          <div className="bg-gray-50 rounded-xl p-4 border">
            <h3 className="font-semibold text-[#1a237e] mb-2">
              Earned Leave
            </h3>

            <p className="text-sm text-gray-600">
              Total:{" "}
              <span className="font-bold">
                {leaveLimits.EARNED}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Used:{" "}
              <span className="font-bold text-red-600">
                {leaveUsage.EARNED}
              </span>
            </p>
            <p className="text-sm text-gray-600">
              Remaining:{" "}
              <span className="font-bold text-green-600">
                {leaveLimits.EARNED - leaveUsage.EARNED}
              </span>
            </p>

          </div>

        </div>
      </section>

      {/* ================= LEAVE SUMMARY ================= */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <BarChart3 className="text-[#1a237e]" />
          <h2 className="text-xl font-bold text-[#1a237e]">
            {t("leaveSummary")}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title={t("pending")} value={stats.pending} color="pending" />
          <StatCard title={t("approved")} value={stats.approved} color="approved" />
          <StatCard title={t("rejected")} value={stats.rejected} color="rejected" />
          <StatCard title={t("draft")} value={stats.draft} color="draft" />
        </div>
      </section>
        {/* ================= QUICK ACTIONS ================= */}
      <section className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="primary"
          onClick={() => navigate("/police/apply-leave")}
          className="w-full sm:w-auto"
        >
          {t("applyLeave")}
        </Button>

        <Button
          variant="white"
          onClick={() => navigate("/police/leave-status")}
          className="w-full sm:w-auto"
        >
          {t("viewLeaveStatus")}
        </Button>
      </section>
      {/* ================= RECENT LEAVES ================= */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-5">
          <Clock className="text-[#1a237e]" />
          <h3 className="text-xl font-bold text-[#1a237e]">
            {t("recentLeaveRequests")}
          </h3>
        </div>

        {recentLeaves.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <FileText size={50} />
            <p className="mt-2 text-sm">{t("noLeaveRecords")}</p>
          </div>
        ) : (
          <div className="hidden md:block">
            <LeaveStatusTable
              leaves={recentLeaves}
              onEdit={(id) =>
                navigate("/police/apply-leave", { state: { leaveId: id } })
              }
            />
          </div>
        )}
      </section>


      {/* ================= APPROVAL SECTION ================= */}
      {isSenior && (
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-5">
            <CheckCircle className="text-[#FF9933]" />
            <h2 className="text-xl font-bold text-[#1a237e]">
              {t("leaveApprovalOverview")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard title={t("pending")} value={approvalStats.pending} color="pending" />
            <StatCard title={t("approved")} value={approvalStats.approved} color="approved" />
            <StatCard title={t("rejected")} value={approvalStats.rejected} color="rejected" />
          </div>
        </section>
      )}

    
      {/* ================= RECENT LEAVE APPROVALS ================= */}
      {isSenior && (
  <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center gap-3 mb-5">
      <Clock className="text-[#1a237e]" />
      <h3 className="text-xl font-bold text-[#1a237e]">
        {t("recentLeaveApprovals")}
      </h3>
    </div>

    {myRecentApprovedLeaves.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400">
        <FileText size={50} />
        <p className="mt-2 text-sm">{t("noLeaveRecords")}</p>
      </div>
    ) : (
      <div className="hidden md:block">
        <LeaveStatusTable
          leaves={myRecentApprovedLeaves}
          onEdit={(id) =>
            navigate("/police/apply-leave", { state: { leaveId: id } })
          }
        />
      </div>
    )}
  </section>
)}

    </div>
  );
};

export default UserDashboard;
