import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";
import ActionButtons from "./ActionButtons";
import type { Leave } from "../../type/leave";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { statusColorMap } from "../../utils/statusConfig";

type LeaveStatusTableProps = {
  leaves: Leave[];
  onEdit: (leave: Leave) => void;
};
const ROWS_PER_PAGE = 10;

const LeaveStatusTable = ({ leaves }: LeaveStatusTableProps) => {
  const navigate = useNavigate();
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
    // { header: "Name", accessor: "name" },
    { header: "Type", accessor: "leaveType" },
    { header: "Dates", accessor: "dates" },
    {header:"Number of Days", accessor: "numberOfDays"},
    { header: "Reason", accessor: "reason" },
    { header: "Submitted On", accessor: "submittedOn" },
    // { header: "Assigned To", accessor: "currentApproverId" },
    { header: "Status", accessor: "status" },
    { header: "Actions", accessor: "actions" },
    { header: "Rejection Reason", accessor: "rejectionReason" },
  ] as const;

  // Map paginatedLeaves to rows for the Table component
  const data = paginatedLeaves.map((leave) => ({
    // name: leave.name,
    leaveType: leave.leaveType,
    dates: leave.from !== leave.to ? `${formatDate(leave.from)} - ${formatDate(leave.to)}` : formatDate(leave.from),
    numberOfDays: leave.numberOfDays,
    reason: leave.reason,
    submittedOn: formatDate(leave.submittedOn),
    currentApproverId: leave.currentApproverId ?? "-",
    status: <StatusBadge status={leave.status} colorMap={statusColorMap} />,
    actions: (
      <ActionButtons
        status={leave.status}
        onEdit={() => navigate("/police/apply-leave", { state: { leaveId: leave.id } })}
      />
    ),
    rejectionReason: leave.status === "REJECTED" ? leave.rejectionReason || "Reason not provided" : "-",
       
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

export default LeaveStatusTable;