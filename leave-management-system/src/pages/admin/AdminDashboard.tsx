import DashboardLayout from "../../layouts/DashboardLayout";
import { useLeave } from "../../context/LeaveContext";
import { useAuth } from "../../context/AuthContext";
import { useUsers } from "../../context/UserContext";
import StatusBadge from "../../ui/StatusBadge";
import { statusColorMap } from "../../utils/statusConfig";
import DashboardCard from "../../ui/DashboardCard";
import CardGrid from "../../ui/CardGrid";

const AdminDashboard = () => {
  const { leaves } = useLeave();
  const { user } = useAuth();
  const { users } = useUsers();

  /* ================= LEAVE STATS ================= */
  const totalLeaves = leaves.length;
  const pending = leaves.filter(l => l.status === "PENDING").length;
  const approved = leaves.filter(l => l.status === "APPROVED").length;
  const rejected = leaves.filter(l => l.status === "REJECTED").length;

  const totalactiveUsers = users.filter(u => u.isActive).length;
  const totalinactiveUsers = users.filter(u => !u.isActive).length;
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

  return (
    <DashboardLayout>
      <div className="min-h-screen space-y-8">

        {/* ===== HEADER ===== */}
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-gray-600">
            Welcome, {user?.name}
          </p>
        </div>

        {/* ===== LEAVE OVERVIEW ===== */}
        <section className="bg-white border rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">Leave Overview</h2>
          <CardGrid>
            <DashboardCard title="Total Leaves" value={totalLeaves} />
            <DashboardCard title="Pending" value={pending} color="text-yellow-600" />
            <DashboardCard title="Approved" value={approved} color="text-green-600" />
            <DashboardCard title="Rejected" value={rejected} color="text-red-600" />
             <DashboardCard title="Forwarded" value={0} color="text-blue-600" />
          </CardGrid>
        </section>

        {/* ===== ACTIVE USERS (RANK WISE) ===== */}
        <section className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold mb-4">
            Total Active Users - <span className="text-xl font-bold text-green-800" >{totalactiveUsers}</span> 
          </h2>

          <CardGrid>
            <DashboardCard title="Constable" value={activeByRank("CONSTABLE")} />
            <DashboardCard title="Head Constable" value={activeByRank("HEAD_CONSTABLE")} />
            <DashboardCard title="SI" value={activeByRank("SI")} />
            <DashboardCard title="Inspector" value={activeByRank("INSPECTOR")} />
            <DashboardCard title="SHO" value={activeByRank("SHO")} />
          </CardGrid>
        </section>

        {/* ===== INACTIVE USERS (RANK WISE) ===== */}
        <section className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
           <h2 className="text-lg font-semibold mb-4">
            Total Inactive Users - <span className="text-xl font-bold text-red-800" >{totalinactiveUsers}</span> 
          </h2>

          <CardGrid>
            <DashboardCard title="Constable" value={inactiveByRank("CONSTABLE")} />
            <DashboardCard title="Head Constable" value={inactiveByRank("HEAD_CONSTABLE")} />
            <DashboardCard title="SI" value={inactiveByRank("SI")} />
            <DashboardCard title="Inspector" value={inactiveByRank("INSPECTOR")} />
            <DashboardCard title="SHO" value={inactiveByRank("SHO")} />
          </CardGrid>
        </section>

        {/* ===== RECENT LEAVES ===== */}
        <section>
          <h2 className="text-lg font-semibold mb-3">
            Recent Leave Requests
          </h2>

          <div className="bg-white rounded-xl border overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">Leave Type</th>
                  <th className="p-3 text-left">Dates</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {recentLeaves.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  recentLeaves.map(leave => (
                    <tr key={leave.id} className="border-t">
                      <td className="p-3">{leave.name ?? "—"}</td>
                      <td className="p-3">{leave.leaveType}</td>
                      <td className="p-3">
                        {leave.from === leave.to
                          ? leave.from
                          : `${leave.from} - ${leave.to}`}
                      </td>
                      <td className="p-3">
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
