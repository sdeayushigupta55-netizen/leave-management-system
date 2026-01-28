import DashboardLayout from "../../layouts/DashboardLayout";
import { useLeave } from "../../context/LeaveContext";
import { Check, X, ArrowRight } from "lucide-react";
const SeniorDashboard = () => {
  const { leaves, editLeave } = useLeave();
  const pendingLeaves = leaves.filter(leave => leave.status === "PENDING");

// Action handlers
  const handleApprove = (id: number) => {
    editLeave(id, { status: "APPROVED" });
  };
  const handleReject = (id: number) => {
    editLeave(id, { status: "REJECTED" });
  };
  const handleForward = (id: number) => {
    // For demonstration, you can set status to "FORWARDED" or implement your own logic
    editLeave(id, { status: "FORWARDED" });
  };

  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold mb-4">Pending Leave Requests</h1>
      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow border text-xs sm:text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Leave Type</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Dates Requested</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Reason</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Submitted On</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Assigned To</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingLeaves.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  No pending leave requests.
                </td>
              </tr>
            ) : (
              pendingLeaves.map(leave => (
                <tr key={leave.id} className="border-t last:border-b-0">
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.leaveType}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">
                    {leave.from}{leave.from !== leave.to && ` - ${leave.to}`}
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.reason}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.submittedOn}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.assignedTo}</td>
                 <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">
  <div className="flex flex-wrap gap-1 sm:gap-2">
    <button
      className="bg-green-500 hover:bg-green-600 text-white p-1 sm:p-2 rounded"
      onClick={() => handleApprove(leave.id)}
      title="Approve"
    >
      <Check size={16} />
    </button>
    <button
      className="bg-red-500 hover:bg-red-600 text-white p-1 sm:p-2 rounded"
      onClick={() => handleReject(leave.id)}
      title="Reject"
    >
      <X size={16} />
    </button>
    <button
      className="bg-blue-500 hover:bg-blue-600 text-white p-1 sm:p-2 rounded"
      onClick={() => handleForward(leave.id)}
      title="Forward"
    >
      <ArrowRight size={16} />
    </button>
  </div>
</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default SeniorDashboard;