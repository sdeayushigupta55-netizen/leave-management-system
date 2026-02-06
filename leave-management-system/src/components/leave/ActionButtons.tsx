import { useTranslation } from "react-i18next";
import { Edit } from "lucide-react";

type ActionButtonsProps = {
  status: string;
  onEdit: () => void;
};

const ActionButtons = ({ status, onEdit }: ActionButtonsProps) => {
  const { t } = useTranslation();

  // Only show edit for DRAFT status
  if (status !== "DRAFT") {
    return <span className="text-gray-400">-</span>;
  }

  return (
    <button
      onClick={onEdit}
      className="flex items-center gap-1.5 text-[#1a237e] text-sm font-semibold hover:text-[#303f9f] transition"
    >
      <Edit size={14} />
      {t("edit")}
    </button>
  );
};

export default ActionButtons;