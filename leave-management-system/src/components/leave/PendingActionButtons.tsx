import { Check, X, ArrowRight } from "lucide-react";
import type { Leave } from "../../type/leave";
import { useState } from "react";

type PendingLeaveStatusTableProps = {
  status: Leave["status"];
  leaveId: string;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
};

const PendingActionButtons = ({
  status,
  leaveId,
  onApprove,
  onReject,
}: PendingLeaveStatusTableProps) => {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason] = useState("");

  if (status === "PENDING") {
    return (
      <div className="flex gap-2 items-center">
        <button
          onClick={() => onApprove(leaveId)}
          className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
          title="Approve"
        >
          <Check size={16} />
        </button>
        <button
          onClick={() => setShowReason((v) => !v)}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
          title="Reject"
        >
          <X size={16} />
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          title="Forward"
        >
          <ArrowRight size={16} />
        </button>
        {showReason && (
          <form
            className="flex gap-2 items-center"
            onSubmit={e => {
              e.preventDefault();
              if (reason.trim()) {
                onReject(leaveId, reason);
                setReason("");
                setShowReason(false);
              }
            }}
          >
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Rejection reason"
              className="border rounded px-2 py-1 text-sm"
              autoFocus
              required
            />
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
            >
              Submit
            </button>
            <button
              type="button"
              className="text-xs px-2 py-1"
              onClick={() => setShowReason(false)}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    );
  }

  return <span className="text-gray-400 text-xs">—</span>;
};

export default PendingActionButtons;