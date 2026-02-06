import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

type PendingActionButtonsProps = {
  status: string;
  leaveId: string;
  onApprove: () => void;
  onReject: () => void;
};

const PendingActionButtons = ({
  status,
  onApprove,
  onReject,
}: PendingActionButtonsProps) => {
  const { t } = useTranslation();

  if (status !== "PENDING") {
    return null;
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
    </div>
  );
};

export default PendingActionButtons;