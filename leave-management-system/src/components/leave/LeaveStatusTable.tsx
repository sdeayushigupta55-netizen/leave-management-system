import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";
import type { Leave } from "../../type/leave";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow border text-xs sm:text-sm">
        <thead className="bg-primary text-white">
          <tr>
            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Type</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Dates</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Reason</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Submitted On</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Assigned To</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Status</th>
            <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedLeaves.map((leave) => (
            <tr key={leave.id} className="border-t last:border-b-0">
              <td className="py-1 px-2 sm:py-2 sm:px-4">{leave.leaveType}</td>
              <td className="py-1 px-2 sm:py-2 sm:px-4">
                {leave.from}{leave.from !== leave.to && ` - ${leave.to}`}
              </td>
              <td className="py-1 px-2 sm:py-2 sm:px-4">{leave.reason}</td>
              <td className="py-1 px-2 sm:py-2 sm:px-4">{leave.submittedOn}</td>
              <td className="py-1 px-2 sm:py-2 sm:px-4">{leave.assignedTo}</td>
              <td className="py-1 px-2 sm:py-2 sm:px-4">
                <StatusBadge status={leave.status} />
              </td>
              <td className="py-1 px-2 sm:py-2 sm:px-4">
                <ActionButtons 
                  status={leave.status} 
                  onEdit={() => navigate("/employee/apply-leave", { state: { leaveId: leave.id } })} 
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <span>
          Showing {((page - 1) * ROWS_PER_PAGE) + 1}-
          {Math.min(page * ROWS_PER_PAGE, leaves.length)} of {leaves.length}
        </span>
        <div className="space-x-2">
          <button
            disabled={page === 1}
            onClick={handlePrev}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={handleNext}
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
