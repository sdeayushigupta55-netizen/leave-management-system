import { Pencil, RotateCcw } from "lucide-react";
import type { Leave } from "../../type/leave";

type ActionButtonsProps = {
  status: Leave["status"];
  onEdit: () => void;
};

const ActionButtons = ({ status, onEdit }: ActionButtonsProps) => {
  // Only show action for DRAFT and REJECTED
  if (status !== "DRAFT" && status !== "REJECTED") {
    return null;
  }

  // Decide button properties based on status
  const buttonProps =
    status === "DRAFT"
      ? { title: "Edit Leave", icon: <Pencil size={16} />, bg: "bg-gray-500 hover:bg-gray-600" }
      : { title: "Resubmit Leave", icon: <RotateCcw size={16} />, bg: "bg-red-500 hover:bg-red-600" };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`${buttonProps.bg} text-white px-2 py-1 rounded flex items-center justify-center`}
        title={buttonProps.title}
        onClick={onEdit} // ✅ This will trigger the parent function
      >
        {buttonProps.icon}
      </button>
    </div>
  );
};

export default ActionButtons;
