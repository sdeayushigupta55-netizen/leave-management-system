import { useState } from "react";
import { useLeave } from "../../context/LeaveContext";
import LeaveStatusTable from "../../components/leave/LeaveStatusTable";
import LeaveStatusCard from "../../components/leave/LeaveStatusCard";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { LeaveStatusType } from "../../type/leave";

const ROWS_PER_PAGE = 10;

const LeaveStatus = () => {
  const { leaves, editLeave } = useLeave();

  // Filters
  const [statusFilter, setStatusFilter] = useState<LeaveStatusType | "ALL">("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  // Helper to parse your leave "Apr 25" string to Date
  const parseLeaveDate = (dateStr: string) => {
    const [monthStr, dayStr] = dateStr.split(" ");
    const month = new Date(`${monthStr} 1, 2000`).getMonth(); // "Apr" -> 3
    const day = parseInt(dayStr, 10);
    const year = new Date().getFullYear(); // Use current year
    return new Date(year, month, day);
  };

  // Filtered leaves
  const filteredLeaves = leaves.filter((leave) => {
    // Status filter
    const statusMatch = statusFilter === "ALL" || leave.status === statusFilter;

    // Date filter
    const leaveFrom = parseLeaveDate(leave.from);
    const leaveTo = parseLeaveDate(leave.to);
    const from = fromDate ? new Date(fromDate) : null;
    const to = toDate ? new Date(toDate) : null;

    let dateMatch = true;
    if (from && to) dateMatch = leaveFrom >= from && leaveTo <= to;
    else if (from) dateMatch = leaveFrom >= from;
    else if (to) dateMatch = leaveTo <= to;

    return statusMatch && dateMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeaves.length / ROWS_PER_PAGE);
  const paginatedLeaves = filteredLeaves.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <DashboardLayout>
      <div className="w-full min-h-screen bg-gray-50 p-2 sm:p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          {/* Heading */}
          <h1 className="text-xl font-bold">Leave Status</h1>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            {/* Status Filter */}
            <select
              className="border rounded px-3 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeaveStatusType | "ALL")}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
              <option value="FORWARDED">Forwarded</option>
            </select>

            {/* From Date */}
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />

            {/* To Date */}
            <input
              type="date"
              className="border rounded px-3 py-2"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>


        {/* Table for larger screens */}
        <div className="hidden sm:block">
          <LeaveStatusTable
            leaves={paginatedLeaves}
            onEdit={(leave) => editLeave(leave.id, leave)}
          />
        </div>

        {/* Card for mobile */}
        <div className="sm:hidden">
          <LeaveStatusCard
            leaves={paginatedLeaves}
            onEdit={(leave) => editLeave(leave.id, leave)}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 text-sm">
            <span>
              Showing {(page - 1) * ROWS_PER_PAGE + 1}-
              {Math.min(page * ROWS_PER_PAGE, filteredLeaves.length)} of {filteredLeaves.length}
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
        )}
      </div>
    </DashboardLayout>
  );
};

export default LeaveStatus;
