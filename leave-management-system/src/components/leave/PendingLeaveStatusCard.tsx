import StatusBadge from "../../ui/StatusBadge";
import type { Leave } from "../../type/leave";
import { useTranslation } from "react-i18next";
import { statusColorMap } from "../../utils/statusConfig";
import { leaveTypeToKey } from "../../utils/translationHelper";
import PendingActionButtons from "./PendingActionButtons";
import { Check, X } from "lucide-react";
import { canApproverApprove } from "../../context/LeaveContext";
import { useAuth } from "../../context/AuthContext";

type PendingLeaveStatusCardProps = {
  leaves: Leave[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onForward: (id: string) => void;
};

const PendingLeaveStatusCard = ({
  leaves,
  onApprove,
  onReject,
  onForward,
}: PendingLeaveStatusCardProps) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();

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
      {leaves.map((leave) => {
        // Check if current user can approve this leave
        const approverCanApprove = user?.rank
          ? canApproverApprove(user.rank, leave.numberOfDays, leave.applicantRank)
          : false;

        return (
          <div
            key={leave.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-[#1a237e] text-base">
                  {leave.name}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {leave.applicantRank}
                </span>
              </div>
              <StatusBadge status={leave.status} colorMap={statusColorMap} />
            </div>

            {/* Leave Type & Dates */}
            <div className="mb-3 bg-gradient-to-r from-[#1a237e]/5 to-[#c5a200]/5 p-3 rounded-xl">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-[#1a237e] text-sm">
                  {translateLeaveType(leave.leaveType)}
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  {leave.numberOfDays} {t("days")}
                </span>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {formatDate(leave.from)}
                {leave.from !== leave.to && ` - ${formatDate(leave.to)}`}
              </span>
            </div>

            {/* Reason */}
            <div className="mb-3 bg-gray-50 p-3 rounded-xl">
              <span className="text-xs text-gray-500 block mb-1">{t("reason")}</span>
              <p className="text-sm text-gray-700 line-clamp-2">{leave.reason}</p>
            </div>

            {/* Submitted On */}
            <div className="mb-3 text-xs text-gray-500">
              <span>{t("submittedOn")}: </span>
              <span className="font-medium text-gray-700">
                {formatDate(leave.submittedOn)}
              </span>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-3 border-t border-gray-100">
              {leave.status === "APPROVED" ? (
                <div className="flex items-center gap-2 text-[#138808]">
                  <Check size={16} />
                  <span className="text-sm font-medium">{t("approved")}</span>
                </div>
              ) : leave.status === "REJECTED" ? (
                <div className="flex items-center gap-2 text-[#c62828]">
                  <X size={16} />
                  <span className="text-sm font-medium">{t("rejected")}</span>
                </div>
              ) : (
                <PendingActionButtons
                  status={leave.status}
                  leaveId={leave.id}
                  canApprove={approverCanApprove}
                  onApprove={() => onApprove(leave.id)}
                  onReject={() => onReject(leave.id)}
                  onForward={() => onForward(leave.id)}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PendingLeaveStatusCard;
