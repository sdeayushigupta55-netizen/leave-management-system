import StatusBadge from "../../ui/StatusBadge";
import ActionButtons from "./ActionButtons";
import type { Leave } from "../../type/leave";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { statusColorMap } from "../../utils/statusConfig";
import { leaveTypeToKey } from "../../utils/translationHelper";
import { generateLeaveApprovalPDF } from "../../utils/generateLeaveApprovalPDF";
import { FileDown } from "lucide-react";

interface LeaveStatusCardProps {
  leaves: Leave[];
  onEdit: (leave: Leave) => void;
}

const LeaveStatusCard = ({ leaves }: LeaveStatusCardProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(i18n.language === "hi" ? "hi-IN" : "en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const translateLeaveType = (type: string) => {
    const key = leaveTypeToKey[type];
    return key ? t(key) : type;
  };

  return (
    <div className="flex flex-col gap-3">
      {leaves.map((leave) => (
        <div key={leave.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex flex-col gap-1">
              <span className="font-bold text-[#1a237e] text-base sm:text-lg">
                {translateLeaveType(leave.leaveType)}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(leave.from)}
                {leave.from !== leave.to && ` - ${formatDate(leave.to)}`}
                {leave.numberOfDays && ` (${leave.numberOfDays} ${t("days")})`}
              </span>
            </div>
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
            </div>
          </div>

          {/* Reason */}
          <div className="mb-3 bg-gray-50 p-3 rounded-xl">
            <span className="text-xs text-gray-500 block mb-1">{t("reason")}</span>
            <p className="text-sm text-gray-700 line-clamp-2">{leave.reason}</p>
          </div>

          {/* Assigned To */}
          {leave.currentApproverName && (
            <div className="mb-3 text-xs text-gray-500">
              <span>{t("assignedTo")}: </span>
              <span className="font-semibold text-[#1a237e]">{leave.currentApproverName}</span>
            </div>
          )}

          {/* Rejection Reason */}
          {leave.status === "REJECTED" && leave.Reason && (
            <div className="mb-3 p-3 bg-[#ffebee] rounded-xl text-xs text-[#c62828]">
              <span className="font-semibold">{t("Reason")}: </span>
              {leave.Reason}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end pt-3 border-t border-gray-100">
            <ActionButtons
              status={leave.status}
              onEdit={() => navigate("/police/apply-leave", { state: { leaveId: leave.id } })}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default LeaveStatusCard;