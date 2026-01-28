import { Check, X, ArrowRight } from "lucide-react";
import type { Leave } from "../../type/leave";

interface Props {
  leaves: Leave[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onForward: (id: string) => void;
}

const SeniorLeaveCard = ({ leaves, onApprove, onReject, onForward }: Props) => {
  if (leaves.length === 0) {
    return (
      <p className="text-center text-gray-500 md:hidden">
        No pending leave requests.
      </p>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {leaves.map((leave) => (
        <div
          key={leave.id}
          className="bg-white p-4 rounded shadow border"
        >
          <p className="font-semibold">{leave.leaveType}</p>

          <p className="text-sm text-gray-600">
            <strong>Dates:</strong> {leave.from}{leave.from !== leave.to && ` - ${leave.to}`}
          </p>

          <p className="text-sm text-gray-600">
            <strong>Reason:</strong> {leave.reason}
          </p>

          <p className="text-sm text-gray-600">
            <strong>Submitted:</strong> {leave.submittedOn}
          </p>

          <p className="text-sm text-gray-600 mb-3">
            <strong>Assigned:</strong> {leave.assignedTo}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onApprove(leave.id)}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded"
              title="Approve Leave"
            >
              <Check className="mx-auto" size={16} />
            </button>
            <button
              onClick={() => onReject(leave.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
              title="Reject Leave"
            >
              <X className="mx-auto" size={16} />
            </button>
            <button
              onClick={() => onForward(leave.id)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
              title="Forward Leave"
            >
              <ArrowRight className="mx-auto" size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SeniorLeaveCard;
