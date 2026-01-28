import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";
import type { Leave } from "../../type/leave";
import { useNavigate } from "react-router-dom";
interface LeaveStatusCardProps {
  leaves: Leave[];
  onEdit: (leave: Leave) => void;
}

const LeaveStatusCard  = ({ leaves }: LeaveStatusCardProps) => {
    const navigate = useNavigate();
    return (
  <div className="flex flex-col gap-3">
    {leaves.map((leave) => (
      <div key={leave.id} className="bg-white rounded shadow border p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <span className="font-semibold text-xl">{leave.leaveType}</span>
           <div className="flex gap-2 flex-wrap">
          <StatusBadge status={leave.status} />
           <ActionButtons
              status={leave.status}
             onEdit={() => navigate("/employee/apply-leave", { state: { leaveId: leave.id } })} 
            />
            </div>
        </div>
      <div>
          <span className="block font-bold">Dates:</span>
          <span>{leave.from}{leave.from !== leave.to && ` - ${leave.to}`}</span>
        </div>
        <div>
          <span className="block font-bold">Reason:</span>
          <span>{leave.reason}</span>
        </div>
      </div>
    ))}
  </div>
)}

export default LeaveStatusCard;