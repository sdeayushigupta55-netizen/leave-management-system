import { Pencil } from "lucide-react";
import type { Leave } from "../../type/leave";

type ActionButtonsProps = {
  status: Leave["status"];
  onEdit: () => void;
};

const ActionButtons = ({ status, onEdit }: ActionButtonsProps) => {
  // Only show edit action for DRAFT
  if (status !== "DRAFT") {
    return <span>-</span>;
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded flex items-center justify-center"
        title="Edit Leave"
        onClick={onEdit}
      >
        <Pencil size={16} />
      </button>
    </div>
  );
};

export default ActionButtons;