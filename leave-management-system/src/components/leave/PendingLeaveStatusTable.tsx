import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";

import type { Leave } from "../../type/leave";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { statusColorMap } from "../../utils/statusConfig";
import PendingActionButtons from "./PendingActionButtons";
import { Check, X } from "lucide-react";

type PendingLeaveStatusTableProps = {
  leaves: Leave[];
//   onEdit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
//   onForward: (id: string) => void;
};
const ROWS_PER_PAGE = 10;

const PendingLeaveStatusTable = ({ leaves, onApprove, onReject }: PendingLeaveStatusTableProps) => {
//   const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(leaves.length / ROWS_PER_PAGE);
  const paginatedLeaves = leaves.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );
  const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

  // Define columns for the Table component
  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "leaveType" },
    { header: "Dates", accessor: "dates" },
    {header:"Number of Days", accessor: "numberOfDays"},
    { header: "Reason", accessor: "reason" },
    { header: "Submitted On", accessor: "submittedOn" },
    // { header: "Assigned To", accessor: "currentApproverId" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
  ] as const;

  // Map paginatedLeaves to rows for the Table component
 const data = paginatedLeaves.map((leave) => ({
  name: leave.name,
  leaveType: leave.leaveType,
  dates: leave.from !== leave.to ? `${formatDate(leave.from)} - ${formatDate(leave.to)}` : formatDate(leave.from),
  numberOfDays: leave.numberOfDays,
  reason: leave.reason,
  submittedOn: formatDate(leave.submittedOn),
  status: <StatusBadge status={leave.status} colorMap={statusColorMap} />,
  actions:
    leave.status === "APPROVED" ? (
      <Check size={16} className="text-green-500" />
    ) : leave.status === "REJECTED" ? (
      <X size={16} className="text-red-500" />
    ) : (
      <PendingActionButtons
        status={leave.status}
        leaveId={leave.id}
        onApprove={() => onApprove(leave.id)}
        onReject={() => onReject(leave.id)}
        // onForward={() => onForward(leave.id)}
        // onEdit={() => onEdit?.(leave.id)}
      />
    ),
}));

  return (
    <div className="w-full overflow-x-auto">
      <Table columns={[...columns]} data={data} />
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Showing {((page - 1) * ROWS_PER_PAGE) + 1}-
          {Math.min(page * ROWS_PER_PAGE, leaves.length)} of {leaves.length}
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendingLeaveStatusTable;