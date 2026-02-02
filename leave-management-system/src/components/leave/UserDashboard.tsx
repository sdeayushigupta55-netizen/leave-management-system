
import { useAuth } from "../../context/AuthContext";
import { useLeave } from "../../context/LeaveContext";
import { useNavigate } from "react-router-dom";
import LeaveStatusTable from "../../components/leave/LeaveStatusTable";
import Button from "../../ui/Button";
import StatCard from "../../ui/StatCard";

const UserDashboard = () => {
  const { user } = useAuth();
  const { leaves } = useLeave();
  const navigate = useNavigate();

  if (!user) return null;

  // 🔐 Only own leaves
  const myLeaves = leaves.filter(
    (leave) => leave.applicantId === user.id
  );

const approvalStats = {
  pending: leaves.filter(
    (leave) =>
      leave.currentApproverId === user.id &&
      leave.status === "PENDING" &&
      leave.applicantId !== user.id // not their own leave
  ).length,
  approved: leaves.filter(
    (leave) =>
      leave.approvals.some(
        (a) => a.approverId === user.id && a.action === "APPROVED"
      )
  ).length,
  rejected: leaves.filter(
    (leave) =>
      leave.approvals.some(
        (a) => a.approverId === user.id && a.action === "REJECTED"
      )
  ).length,
};

  // 📊 Stats
  const stats = {
    pending: myLeaves.filter(l => l.status === "PENDING").length,
    approved: myLeaves.filter(l => l.status === "APPROVED").length,
    rejected: myLeaves.filter(l => l.status === "REJECTED").length,
    draft: myLeaves.filter(l => l.status === "DRAFT").length,
  };

  const approvalleave = {
     pending: approvalStats.pending,
  approved: approvalStats.approved,
  rejected: approvalStats.rejected,
    
  };

  // 🕒 Recent leaves (latest 5)
  const recentLeaves = [...myLeaves].slice(0, 5);

  return (
   
      <div className="w-full min-h-screen bg-gray-50 p-2 sm:p-6 space-y-6 flex flex-col">

        {/* 👮 Profile Card */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-bold mb-1">Hello, {user.name}</h2>
          <p className="text-sm text-gray-600">
            Rank: {user.rank} | Police Station: {user.policeStation}
          </p>
        </div>

        {/* 📊 Leave Stats */}
        
      <section className="rounded p-4 sm:p-6 border bg-white">
  <h2 className="text-lg font-semibold mb-4">My Leave Overview</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    <StatCard title="Pending" value={stats.pending} color="pending" />
    <StatCard title="Approved" value={stats.approved} color="approved" />
    <StatCard title="Rejected" value={stats.rejected} color="rejected" />
    <StatCard title="Draft" value={stats.draft} color="draft" />
  </div>
</section>

{user.role === "POLICE" && user.rank!=="CONSTABLE" && (
  <section className="rounded p-4 sm:p-6 border bg-white">
    <h2 className="text-lg font-semibold mb-4">Leave Approval Overview</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard title="Pending" value={approvalleave.pending} color="pending" />
      <StatCard title="Approved" value={approvalleave.approved} color="approved" />
      <StatCard title="Rejected" value={approvalleave.rejected} color="rejected" />
    </div>
  </section>
)}

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

  );
};

export default UserDashboard;
