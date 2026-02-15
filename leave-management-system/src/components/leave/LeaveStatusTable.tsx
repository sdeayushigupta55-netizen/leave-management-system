import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";
import ActionButtons from "./ActionButtons";
import type { Leave } from "../../type/leave";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUsers } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import { statusColorMap } from "../../utils/statusConfig";
import { leaveTypeToKey } from "../../utils/translationHelper";
import { generateLeaveApprovalPDF } from "../../utils/generateLeaveApprovalPDF";
import { FileDown } from "lucide-react";

type LeaveStatusTableProps = {
  leaves: Leave[];
  onEdit: (leave: Leave) => void;
};

const ROWS_PER_PAGE = 10;

const LeaveStatusTable = ({ leaves }: LeaveStatusTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { users } = useUsers();

  const columns = [
    { header: t("leaveType"), accessor: "leaveType" as const },
    { header: t("dates"), accessor: "dates" as const },
    { header: t("numberOfDays"), accessor: "numberOfDays" as const },

    { header: t("submittedOn"), accessor: "submittedOn" as const },
    { header: t("assignedTo"), accessor: "currentApproverName" as const },
    { header: t("status"), accessor: "status" as const },
    { header: t("Document"), accessor: "Document" as const },
    { header: t("Reason"), accessor: "reason" as const },
  ];

  const paginatedLeaves = leaves.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-GB", { month: "short" }).slice(0, 3);
    const year = String(date.getFullYear()).slice(-2);
    return `${day}'${month}${year}`;
  };

  const translateLeaveType = (type: string) => {
    const key = leaveTypeToKey[type];
    return key ? t(key) : type;
  };

  const data = paginatedLeaves.map((leave) => {
    // Find the last approval (APPROVED or REJECTED)
    let lastApproverName = "-";
    if (leave.status === "APPROVED" || leave.status === "REJECTED") {
      const lastApproval = [...leave.approvals].reverse().find(a => a.action === leave.status);
      if (lastApproval) {
        const approverUser = users.find(u => u.id === lastApproval.approverId);
        lastApproverName = approverUser ? approverUser.name : lastApproval.approverId;
      }
    }
    return {
      Document:
        typeof leave.attachment === 'string' && leave.attachment ? (
          <a
            href={leave.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline whitespace-nowrap flex items-center gap-1"
            title={t("viewLeaveApplication")}
          >
            View
          </a>
        ) : null,
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
      currentApproverName:
        leave.status === "APPROVED" || leave.status === "REJECTED"
          ? lastApproverName
          : leave.currentApproverName ?? "-",
      status: (
        <div className="flex items-center gap-2">
          <StatusBadge status={leave.status} colorMap={statusColorMap} />
          {leave.status === "APPROVED" && (
            <button
              onClick={() => generateLeaveApprovalPDF(leave)}
              className="p-1.5 bg-[#138808] hover:bg-[#0d6b06] text-white rounded-lg transition-colors shadow-sm"
              title={t("downloadPDF")}
            >
              <FileDown size={14} />
            </button>
          )}
          {leave.status==="REJECTED" && (
             <button
              onClick={() => generateLeaveApprovalPDF(leave)}
              className="p-1.5 bg-[#970d0d] hover:bg-[#7a0b0b] text-white rounded-lg transition-colors shadow-sm"
              title={t("downloadPDF")}
            >
              <FileDown size={14} />
            </button>
  )}
          {leave.status === "DRAFT" && (
            <ActionButtons
              status={leave.status}
              onEdit={() => navigate("/police/apply-leave", { state: { leaveId: leave.id } })}
            />
          )}
        </div>
      ),
      Reason:
        leave.status === "REJECTED"
          ? leave.Reason || t("reasonNotProvided")
          : "-",
    };
  });

  const totalPages = Math.ceil(leaves.length / ROWS_PER_PAGE);

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

export default LeaveStatusTable;