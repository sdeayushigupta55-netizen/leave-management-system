import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";
import type { Leave } from "../../type/leave";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { statusColorMap } from "../../utils/statusConfig";
import { leaveTypeToKey } from "../../utils/translationHelper";
import PendingActionButtons from "./PendingActionButtons";
import { Check, X } from "lucide-react";
import { canApproverApprove } from "../../context/LeaveContext";
import { useAuth } from "../../context/AuthContext";

type PendingLeaveStatusTableProps = {
  leaves: Leave[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onForward: (id: string) => void;
};

const ROWS_PER_PAGE = 10;

const PendingLeaveStatusTable = ({
  leaves,
  onApprove,
  onReject,
  onForward,
}: PendingLeaveStatusTableProps) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(leaves.length / ROWS_PER_PAGE);
  const paginatedLeaves = leaves.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  // Format date - shortest form
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-GB", { month: "short" }).slice(0, 3);
    const year = String(date.getFullYear()).slice(-2);
    return `${day}'${month}${year}`;
  };

  // Translate leave type
  const translateLeaveType = (type: string) => {
    const key = leaveTypeToKey[type];
    return key ? t(key) : type;
  };

  // Define columns with translated headers
  const columns = [
    { header: t("name"), accessor: "name" },
    {header: t("rank"), accessor: "applicantRank" },
    { header: t("leaveType"), accessor: "leaveType" },
    { header: t("dates"), accessor: "dates" },
    { header: t("numberOfDays"), accessor: "numberOfDays" },
    { header: t("reason"), accessor: "reason" },
    { header: t("submittedOn"), accessor: "submittedOn" },
    { header: t("status"), accessor: "status" },
    { header: t("actions"), accessor: "actions" },
   
    {header: t("Reason"), accessor: "Reason"},
  ] as const;

  // Map data with translations
  const data = paginatedLeaves.map((leave) => {
    // Check if current user can approve this leave
    const approverCanApprove = user?.rank 
      ? canApproverApprove(user.rank, leave.numberOfDays, leave.applicantRank)
      : false;

    return {
      name: leave.name,
      applicantRank: leave.applicantRank,
      leaveType: translateLeaveType(leave.leaveType),
      dates:
        leave.from !== leave.to
          ? `${formatDate(leave.from)} - ${formatDate(leave.to)}`
          : formatDate(leave.from),
      numberOfDays: leave.numberOfDays,
      reason: (
        <span className="block max-w-[150px] truncate" title={leave.reason}>
          {leave.reason}
        </span>
      ),
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
            canApprove={approverCanApprove}
            onApprove={() => onApprove(leave.id)}
            onReject={() => onReject(leave.id)}
            onForward={() => onForward(leave.id)}
          />
        ),
    };
  });

  return (
    <div className="w-full overflow-x-auto">
      <Table columns={[...columns]} data={data} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <span className="text-gray-600">
            {t("showingResults")} {(page - 1) * ROWS_PER_PAGE + 1}-
            {Math.min(page * ROWS_PER_PAGE, leaves.length)} {t("of")} {leaves.length}
          </span>
          <div className="space-x-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a237e] hover:text-[#1a237e] transition font-medium"
            >
              {t("prev")}
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 border-2 border-gray-200 rounded-lg disabled:opacity-40 hover:border-[#1a237e] hover:text-[#1a237e] transition font-medium"
            >
              {t("next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingLeaveStatusTable;