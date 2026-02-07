import DashboardLayout from "../../layouts/DashboardLayout";
import { useLeaves } from "../../context/LeaveContext";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import StatusBadge from "../../ui/StatusBadge";
import { statusColorMap } from "../../utils/statusConfig";
import { useTranslation } from "react-i18next";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Forward, 
  UserCheck, 
  UserX,
  FileText,
  TrendingUp,
  Shield
} from "lucide-react";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const { leaves } = useLeaves();
  const { user } = useAuth();
  const { users } = useUsers();

  /* ================= LEAVE STATS ================= */
  const totalLeaves = leaves.length;
  const pending = leaves.filter(l => l.status === "PENDING").length;
  const approved = leaves.filter(l => l.status === "APPROVED").length;
  const rejected = leaves.filter(l => l.status === "REJECTED").length;

  // Exclude SSP from counts since SSP is the admin
  const totalactiveUsers = users.filter(u => u.isActive && u.rank !== "SSP").length;
  const totalinactiveUsers = users.filter(u => !u.isActive && u.rank !== "SSP").length;
  
  /* ================= USER HELPERS ================= */
  const activeByRank = (rank: string) =>
    users.filter(
      u => u.isActive && u.role === "POLICE" && u.rank === rank
    ).length;

  const inactiveByRank = (rank: string) =>
    users.filter(
      u => !u.isActive && u.role === "POLICE" && u.rank === rank
    ).length;

  /* ================= RECENT LEAVES ================= */
  const recentLeaves = [...leaves]
    .sort(
      (a, b) =>
        new Date(b.submittedOn).getTime() -
        new Date(a.submittedOn).getTime()
    )
    .slice(0, 5);

  const rankLabels: Record<string, string> = {
    CONSTABLE: "Constable",
    HEAD_CONSTABLE: "Head Constable",
    SI: "Sub Inspector",
    INSPECTOR: "Inspector",
    "SHO/SO": "SHO/SO",
    CO: "Circle Officer",
    SP: "SP",
  };

  const ranks = ["CONSTABLE", "HEAD_CONSTABLE", "SI", "INSPECTOR", "SHO/SO", "CO", "SP"];

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-6 p-2">

        {/* ===== HEADER ===== */}
        <div className="bg-gradient-to-r from-[#1a237e] via-[#283593] to-[#303f9f] rounded-2xl p-6 text-white shadow-xl border-b-4 border-[#c5a200]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#c5a200]/30 rounded-xl backdrop-blur-sm border border-[#c5a200]/50">
              <Shield size={32} className="text-[#ffd54f]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t("sspDashboard")}</h1>
              <p className="text-blue-100 mt-1">
                {t("welcomeBack")}, <span className="font-semibold text-[#ffd54f]">{user?.name}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ===== LEAVE OVERVIEW ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="text-[#1a237e]" size={22} />
            <h2 className="text-lg font-bold text-gray-800">{t("leaveOverview")}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Total Leaves */}
            <div className="bg-gradient-to-br from-[#1a237e] to-[#303f9f] rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-200 text-sm">{t("totalLeaves")}</p>
                  <p className="text-3xl font-bold mt-1">{totalLeaves}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <FileText size={24} />
                </div>
              </div>
            </div>

            {/* Pending */}
            <div className="bg-gradient-to-br from-[#FF9933] to-[#e68a00] rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm">{t("pending")}</p>
                  <p className="text-3xl font-bold mt-1">{pending}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Clock size={24} />
                </div>
              </div>
            </div>

            {/* Approved */}
            <div className="bg-gradient-to-br from-[#138808] to-[#0d6b06] rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">{t("approved")}</p>
                  <p className="text-3xl font-bold mt-1">{approved}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <CheckCircle size={24} />
                </div>
              </div>
            </div>

            {/* Rejected */}
            <div className="bg-gradient-to-br from-[#c62828] to-[#b71c1c] rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">{t("rejected")}</p>
                  <p className="text-3xl font-bold mt-1">{rejected}</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <XCircle size={24} />
                </div>
              </div>
            </div>

            {/* Forwarded */}
            <div className="bg-gradient-to-br from-[#8d6e63] to-[#6d4c41] rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm">{t("forwardedLeaves")}</p>
                  <p className="text-3xl font-bold mt-1">0</p>
                </div>
                <div className="p-2 bg-white/20 rounded-lg">
                  <Forward size={24} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== USERS OVERVIEW ===== */}
        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* ===== ACTIVE USERS ===== */}
          <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#e8f5e9] rounded-xl">
                  <UserCheck className="text-[#138808]" size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{t("activeUsers")}</h2>
                  <p className="text-sm text-gray-500">{t("activePersonnelDesc")}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#138808]">{totalactiveUsers}</div>
            </div>

            <div className="space-y-3">
              {ranks.map((rank) => (
                <div key={rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#e8f5e9] transition-colors">
                  <span className="text-gray-700 font-medium">{rankLabels[rank]}</span>
                  <span className="px-3 py-1 bg-[#c8e6c9] text-[#1b5e20] rounded-full font-semibold text-sm">
                    {activeByRank(rank)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ===== INACTIVE USERS ===== */}
          <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#ffebee] rounded-xl">
                  <UserX className="text-[#c62828]" size={22} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">{t("inactiveUsers")}</h2>
                  <p className="text-sm text-gray-500">{t("inactivePersonnelDesc")}</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-[#c62828]">{totalinactiveUsers}</div>
            </div>

            <div className="space-y-3">
              {ranks.map((rank) => (
                <div key={rank} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-[#ffebee] transition-colors">
                  <span className="text-gray-700 font-medium">{rankLabels[rank]}</span>
                  <span className="px-3 py-1 bg-[#ffcdd2] text-[#b71c1c] rounded-full font-semibold text-sm">
                    {inactiveByRank(rank)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ===== RECENT LEAVES ===== */}
        <section className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2 bg-[#e8eaf6] rounded-xl">
              <TrendingUp className="text-[#1a237e]" size={22} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">{t("recentLeaveRequests")}</h2>
              <p className="text-sm text-gray-500">{t("latestLeaveApplications")}</p>
            </div>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-3">
            {recentLeaves.length === 0 ? (
              <div className="flex flex-col items-center gap-2 text-gray-400 py-8">
                <FileText size={40} strokeWidth={1.5} />
                <p>{t("noLeaveRequests") || "No leave requests found"}</p>
              </div>
            ) : (
              recentLeaves.map(leave => (
                <div key={leave.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#1a237e] to-[#303f9f] rounded-full flex items-center justify-center text-white font-semibold">
                        {leave.name?.charAt(0) ?? "?"}
                      </div>
                      <span className="font-semibold text-gray-800">{leave.name ?? "—"}</span>
                    </div>
                    <StatusBadge status={leave.status} colorMap={statusColorMap} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="px-3 py-1 bg-[#e8eaf6] text-[#1a237e] rounded-lg font-medium">
                      {leave.leaveType}
                    </span>
                    <span className="text-gray-500">
                      {leave.from === leave.to ? leave.from : `${leave.from} → ${leave.to}`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#1a237e] to-[#303f9f]">
                  <th className="p-4 text-left text-sm font-semibold text-white rounded-l-xl">{t("employee") || "Employee"}</th>
                  <th className="p-4 text-left text-sm font-semibold text-white">{t("leaveType") || "Leave Type"}</th>
                  <th className="p-4 text-left text-sm font-semibold text-white">{t("dates") || "Dates"}</th>
                  <th className="p-4 text-left text-sm font-semibold text-white rounded-r-xl">{t("status")}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {recentLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <FileText size={40} strokeWidth={1.5} />
                        <p>{t("noLeaveRequests") || "No leave requests found"}</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  recentLeaves.map(leave => (
                    <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-[#1a237e] to-[#303f9f] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {leave.name?.charAt(0) ?? "?"}
                          </div>
                          <span className="font-medium text-gray-800">{leave.name ?? "—"}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-[#e8eaf6] text-[#1a237e] rounded-lg text-sm font-medium">
                          {leave.leaveType}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {leave.from === leave.to
                          ? leave.from
                          : `${leave.from} → ${leave.to}`}
                      </td>
                      <td className="p-4">
                        <StatusBadge
                          status={leave.status}
                          colorMap={statusColorMap}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
