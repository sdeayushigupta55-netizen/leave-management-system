import Table from "../../ui/Table";
import StatusBadge from "../../ui/StatusBadge";
import ActionButtons from "./ActionButtons";
import type { Leave } from "../../type/leave";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { XCircle } from "lucide-react";
import { useLeaves } from "../../context/LeaveContext";
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

const pageSize = 8; 

const LeaveStatusTable = ({ leaves }: LeaveStatusTableProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { users } = useUsers();
  const { editLeave } = useLeaves();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [leaveToCancel, setLeaveToCancel] = useState<Leave | null>(null);

  const columns = [
    // { header: "#", accessor: "serial" as const },
    { header: t("leaveType"), accessor: "leaveType" as const },
    { header: t("dates"), accessor: "dates" as const },
    { header: t("numberOfDays"), accessor: "numberOfDays" as const },
    { header: t("submittedOn"), accessor: "submittedOn" as const },
    { header: t("assignedTo"), accessor: "currentApproverName" as const },
    { header: t("status"), accessor: "status" as const },
    { header: t("action"), accessor: "actions" as const },
    { header: t("Document"), accessor: "Document" as const },
    { header: t("Reason"), accessor: "reason" as const },
  ];

 

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

  const handleCancel = (leave: Leave) => {
    setLeaveToCancel(leave);
    setShowCancelModal(true);
  };

  const confirmCancel = () => {
    if (leaveToCancel) {
      editLeave(leaveToCancel.id, { status: "CANCELLED", Reason: t("confirmCancelLeave") || "Leave cancelled by user" });
    }
    setShowCancelModal(false);
    setLeaveToCancel(null);
  };

  const closeModal = () => {
    setShowCancelModal(false);
    setLeaveToCancel(null);
  };

  // Sort leaves by submittedOn (latest first)
  const sortedLeaves = [...leaves].sort((a, b) => new Date(b.submittedOn).getTime() - new Date(a.submittedOn).getTime());
  const data = sortedLeaves.map((leave) => {
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
          {leave.status === "REJECTED" && (
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
      actions:
        (leave.status === "PENDING") ? (
          <button
            onClick={() => handleCancel(leave)}
            className="p-1.5 bg-[#b91c1c] hover:bg-[#7f1d1d] text-white rounded-lg transition-colors shadow-sm"
            title={t("cancelLeave")}
          >
            <XCircle size={18} />
          </button>
        ) : <span className="text-gray-400">-</span>,
      Reason:
        leave.status === "REJECTED"
          ? leave.Reason || t("reasonNotProvided")
          : "-",
    };
  });



  return (
    <div className="w-full overflow-x-auto">
      <Table
        columns={[...columns]}
        data={data}
        pageSize={pageSize}
        onPageChange={setPage}
        page={page}
      />
      {/* Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">{t("confirmCancelLeave") || "Are you sure you want to cancel this leave?"}</h2>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium"
              >
                {t("no") || "No"}
              </button>
              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                {t("yes") || "Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveStatusTable;