import { useTranslation } from "react-i18next";
import { Check, X, Forward } from "lucide-react";

type PendingActionButtonsProps = {
  status: string;
  leaveId: string;
  canApprove: boolean; // Whether current approver can approve or only forward
  onApprove: () => void;
  onReject: () => void;
  onForward?: () => void;
};

const PendingActionButtons = ({
  status,
  canApprove,
  onApprove,
  onReject,
  onForward,
}: PendingActionButtonsProps) => {
  const { t } = useTranslation();

  if (status !== "PENDING" && status !== "FORWARDED") {
    return null;
  }

  // If approver cannot approve (e.g., SHO/SO for > 3 days leave), show only Forward
  if (!canApprove) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={onForward}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white rounded-lg text-xs font-semibold hover:shadow-md transition shadow-sm"
        >
          <Forward size={14} />
          {t("forward")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onApprove}
        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#138808] to-[#1b9e10] text-white rounded-lg text-xs font-semibold hover:shadow-md transition shadow-sm"
      >
        <Check size={14} />
        {t("approve")}
      </button>
      <button
        onClick={onReject}
        className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#c62828] to-[#d84315] text-white rounded-lg text-xs font-semibold hover:shadow-md transition shadow-sm"
      >
        <X size={14} />
        {t("reject")}
      </button>
      {onForward && (
        <button
          onClick={onForward}
          className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-[#8d6e63] to-[#6d4c41] text-white rounded-lg text-xs font-semibold hover:shadow-md transition shadow-sm"
        >
          <Forward size={14} />
          {t("forward")}
        </button>
      )}
    </div>
  );
};

export default PendingActionButtons;