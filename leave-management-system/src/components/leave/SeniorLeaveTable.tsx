import { Check, X, ArrowRight, Pencil, RotateCcw } from "lucide-react";
import type { Leave } from "../../type/leave";

interface Props {
  leaves: Leave[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onForward: (id: string) => void;
}

const SeniorLeaveTable = ({ leaves, onApprove, onReject, onForward }: Props) => {
  if (leaves.length === 0) {
    return <p className="text-center text-gray-500 hidden md:block">No pending leave requests.</p>;
  }

  return (
    <div className="hidden md:block w-full overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow border text-sm">
        <thead className="bg-primary text-white">
          <tr>
            <th className="p-3 text-left">Leave Type</th>
            <th className="p-3 text-left">Dates</th>
            <th className="p-3 text-left">Reason</th>
            <th className="p-3 text-left">Submitted On</th>
            <th className="p-3 text-left">Assigned To</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((leave) => (
            <tr key={leave.id} className="border-t">
              <td className="p-3">{leave.leaveType}</td>
              <td className="p-3">
                {leave.from}
                {leave.from !== leave.to && ` - ${leave.to}`}
              </td>
              <td className="p-3">{leave.reason}</td>
              <td className="p-3">{leave.submittedOn}</td>
              <td className="p-3">{leave.assignedTo}</td>
              <td className="p-3">
                <div className="flex justify-center gap-2">
                  {/* Only show approve/reject/forward for pending */}
                  {leave.status === "PENDING" && (
                    <>
                      <button
                        onClick={() => onApprove(leave.id)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => onReject(leave.id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => onForward(leave.id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
                        title="Forward"
                      >
                        <ArrowRight size={16} />
                      </button>
                    </>
                  )}

                  {/* Show Draft / Rejected actions */}
                  {(leave.status === "DRAFT" || leave.status === "REJECTED") && (
                    <button
                      onClick={() => console.log("Edit leave", leave.id)}
                      className={`p-2 rounded text-white ${
                        leave.status === "DRAFT" ? "bg-gray-500 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"
                      }`}
                      title={leave.status === "DRAFT" ? "Edit Leave" : "Resubmit Leave"}
                    >
                      {leave.status === "DRAFT" ? <Pencil size={16} /> : <RotateCcw size={16} />}
                    </button>
                  )}

                  {/* Approved / Forwarded show dash */}
                  {(leave.status === "APPROVED" || leave.status === "FORWARDED") && (
                    <span className="text-gray-400 text-xs">—</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SeniorLeaveTable;
