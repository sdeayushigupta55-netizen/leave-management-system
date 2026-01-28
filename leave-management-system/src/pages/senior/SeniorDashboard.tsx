import DashboardLayout from "../../layouts/DashboardLayout";
import SeniorLeaveTable from "../../components/leave/SeniorLeaveTable";
import SeniorLeaveCard from "../../components/leave/SeniorLeaveCard";
import { useLeave } from "../../context/LeaveContext";

const SeniorDashboard = () => {
  const { leaves, editLeave } = useLeave();

  // Show pending leaves only
  const pendingLeaves = leaves.filter((leave) => leave.status === "PENDING");

  const handleApprove = (id: string) => editLeave(id, { status: "APPROVED" });
  const handleReject = (id: string) => editLeave(id, { status: "REJECTED" });
  const handleForward = (id: string) => editLeave(id, { status: "FORWARDED" });

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold mb-4">Pending Leave Requests</h1>

      {/* Table for desktop */}
      <div className="hidden md:block">
        <SeniorLeaveTable
          leaves={pendingLeaves}
          onApprove={handleApprove}
          onReject={handleReject}
          onForward={handleForward}
        />
      </div>

      {/* Cards for mobile */}
      <div className="md:hidden flex flex-col gap-3">
        {pendingLeaves.length === 0 ? (
          <p className="text-center text-gray-500">No pending leave requests.</p>
        ) : (
          pendingLeaves.map((leave) => (
            <SeniorLeaveCard
              key={leave.id}
              leaves={[leave]}
              onApprove={() => handleApprove(leave.id)}
              onReject={() => handleReject(leave.id)}
              onForward={() => handleForward(leave.id)}
            />
          ))
        )}
      </div>
    </DashboardLayout>
  );
};

export default SeniorDashboard;
