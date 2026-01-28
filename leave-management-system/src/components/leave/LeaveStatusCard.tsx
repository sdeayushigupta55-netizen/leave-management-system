import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";
import type { Leave } from "../../type/leave";

interface LeaveStatusCardProps {
  leaves: Leave[];
  onEdit: (leave: Leave) => void;
}

const LeaveStatusCard: React.FC<LeaveStatusCardProps> = ({ leaves, onEdit }) => (
  <div className="flex flex-col gap-3">
    {leaves.map((leave) => (
      <div key={leave.id} className="bg-white rounded shadow border p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold">{leave.leaveType}</span>
          <StatusBadge status={leave.status} />
        </div>
        <div>
          <span className="block text-gray-500 text-xs">Dates:</span>
          <span>{leave.from}{leave.from !== leave.to && ` - ${leave.to}`}</span>
        </div>
        <div>
          <span className="block text-gray-500 text-xs">Reason:</span>
          <span>{leave.reason}</span>
        </div>
        <div className="flex gap-2 mt-2">
          <td className="py-1 px-2 sm:py-2 sm:px-4">
  <ActionButtons
    status={leave.status}
    onEdit={() => onEdit(leave)}
  />
</td>

        </div>
      </div>
    ))}
  </div>
);

export default LeaveStatusCard;