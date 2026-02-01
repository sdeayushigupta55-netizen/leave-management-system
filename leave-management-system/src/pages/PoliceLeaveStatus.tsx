import { useState } from "react";
import { useLeave } from "../context/LeaveContext";
import LeaveStatusTable from "../components/leave/LeaveStatusTable";
import LeaveStatusCard from "../components/leave/LeaveStatusCard";
import DashboardLayout from "../layouts/DashboardLayout";
import type { LeaveStatus } from "../type/leave";
import { useAuth } from "../context/AuthContext";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

const ROWS_PER_PAGE = 10;

const PoliceLeaveStatus = () => {
  const { leaves, editLeave } = useLeave();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filters
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "ALL">("ALL");
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
  const myLeaves = leaves.filter(
    leave => leave.applicantId === user?.id
  );
  // Filtered leaves
  const filteredLeaves = myLeaves.filter((leave) => {
    const statusMatch =
      statusFilter === "ALL" || leave.status === statusFilter;

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
        {/* Heading */}
        <div className="flex items-center justify-between">
           {/* Filters */}
            <div className="flex gap-2  flex-wrap">
              <h1 className="text-xl font-bold">Leave Status</h1>
            </div>
          <div className="flex items-center justify-end  gap-2 mb-2">
           

            {/* From Date */}
            <input
              type="date"
              
              className="border rounded px-2 py-1"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            {/* To Date */}
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            {/* Status Filter */}
            <select
              className="border rounded px-2 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeaveStatus | "ALL")}
            >
              <option value="ALL">Status</option>
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="DRAFT">Draft</option>
             
            </select>
            <Button variant="primary" onClick={() => navigate("/police/apply-leave")}>Apply Leave</Button>
            
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

export default PoliceLeaveStatus;
