import DashboardLayout from "../../layouts/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { useLeave } from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
import LeaveStatusTable from "../../components/leave/LeaveStatusTable";
import Button from "../../ui/Button";

const ConstableDashboard = () => {
  const { user } = useAuth();
  const { leaves } = useLeave();
  const navigate = useNavigate();

  if (!user) return null;

  // 🔐 Only own leaves
  const myLeaves = leaves.filter(
    (leave) => leave.applicantId === user.id
  );

  // 📊 Stats
  const stats = {
    pending: myLeaves.filter(l => l.status === "PENDING").length,
    approved: myLeaves.filter(l => l.status === "APPROVED").length,
    rejected: myLeaves.filter(l => l.status === "REJECTED").length,
    draft: myLeaves.filter(l => l.status === "DRAFT").length,
  };

  // 🕒 Recent leaves (latest 5)
  const recentLeaves = [...myLeaves].slice(0, 5);

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-gray-50 p-2 sm:p-6 space-y-6 flex flex-col">

        {/* 👮 Profile Card */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-1">Hello, {user.name}</h2>
          <p className="text-sm text-gray-600">
            Rank: {user.rank} | Police Station: {user.policeStation}
          </p>
        </div>

        {/* 📊 Leave Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard title="Pending" value={stats.pending} color="bg-yellow-100 text-yellow-700" />
          <StatCard title="Approved" value={stats.approved} color="bg-green-100 text-green-700" />
          <StatCard title="Rejected" value={stats.rejected} color="bg-red-100 text-red-700" />
          <StatCard title="Draft" value={stats.draft} color="bg-gray-100 text-gray-700" />
        </div>

        {/* ⚡ Quick Actions */}
        <div className="flex gap-3 flex-wrap">
          <Button
          variant="primary"
            onClick={() => navigate("/police/apply-leave")}
            
          >
            Apply Leave
          </Button>
          <Button
            onClick={() => navigate("/police/leave-status")}
            variant="white"
          >
            View Leave Status
          </Button>
        </div>

        {/* 📄 Recent Leaves */}
        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-bold mb-3">Recent Leave Requests</h3>

          {recentLeaves.length === 0 ? (
            <p className="text-sm text-gray-500">No leave records found.</p>
          ) : (


            <LeaveStatusTable
              leaves={recentLeaves}
              onEdit={(leaveId) => navigate("/police/apply-leave", { state: { leaveId } })}
            />
               
    
          )}
      </div>
    </div>        
    </DashboardLayout >
  );
};

export default ConstableDashboard;

/* ------------------ Small Stat Card ------------------ */

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div className={`rounded p-4 ${color}`}>
    <p className="text-medium">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);
