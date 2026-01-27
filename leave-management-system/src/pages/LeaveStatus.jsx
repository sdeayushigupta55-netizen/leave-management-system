

import React, { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { statusConfig } from "../utils/statusConfig";
import { useLeave } from "../context/LeaveContext";


const ROWS_PER_PAGE = 10;

const LeaveStatus = () => {
  const { leaves } = useLeave();
  const canEdit = (status) => ["DRAFT", "REJECTED"].includes(status);

  // Pagination state
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(leaves.length / ROWS_PER_PAGE);
  const paginatedLeaves = leaves.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <DashboardLayout>
      <h2 className="text-xl font-semibold mb-6">Leave Request History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow border text-xs sm:text-sm">
          <thead className="bg-primary text-white">
            <tr>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Leave Type</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Dates Requested</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Reason</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Submitted On</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Status</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 text-left font-medium whitespace-nowrap">Assigned To</th>
              <th className="py-2 px-2 sm:py-3 sm:px-4 whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {paginatedLeaves.map((leave) => {
              const statusMeta = statusConfig[leave.status];
              return (
                <tr key={leave.id} className="border-t last:border-b-0">
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.leaveType}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.from}{leave.from !== leave.to && ` - ${leave.to}`}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.reason}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.submittedOn}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 sm:px-3 sm:py-1 text-xs rounded-full bg-${statusMeta.color}-100 text-${statusMeta.color}-700`}
                    >
                      {statusMeta.label}
                    </span>
                  </td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 whitespace-nowrap">{leave.assignedTo}</td>
                  <td className="py-1 px-2 sm:py-2 sm:px-4 text-right whitespace-nowrap">
                    {canEdit(leave.status) && (
                      <button className="text-xs sm:text-sm text-primary hover:underline">✏️ Edit</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
        <span className="text-xs text-gray-500">
          Showing {((page - 1) * ROWS_PER_PAGE) + 1}
          -{Math.min(page * ROWS_PER_PAGE, leaves.length)} of {leaves.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded border text-sm ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          >
            Previous
          </button>
          <span className="text-xs text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded border text-sm ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white hover:bg-gray-50 text-gray-700'}`}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LeaveStatus;
