import type { User } from "../../type/user";
import StatusBadge from "../../ui/StatusBadge";
import ToggleUserButton from "../../ui/Toggle";
import { userStatusColorMap } from "../../utils/statusConfig";
import { Edit } from "lucide-react";

type Props = {
  user: User;
  onToggle: (id: string) => void;
  onEdit?: (user: User) => void;
};

const UserCard = ({ user, onToggle, onEdit }: Props) => {
    
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3 hover:shadow-md transition-shadow">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-[#1a237e] text-base">{user.name}</h3>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        <StatusBadge
          status={user.isActive ? "ACTIVE" : "INACTIVE"}
          colorMap={userStatusColorMap}
        />
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-gray-500 text-xs">Role</p>
          <p className="font-semibold text-gray-800">{user.role}</p>
        </div>

        <div className="bg-gray-50 p-2 rounded-lg">
          <p className="text-gray-500 text-xs">Rank</p>
          <p className="font-semibold text-gray-800">{user.rank || "-"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit?.(user)}
          className="flex items-center gap-1.5 text-sm text-[#1a237e] font-semibold hover:text-[#303f9f] transition-colors"
        >
          <Edit size={14} />
          Edit
        </button>

        <ToggleUserButton
          checked={user.isActive}
          onChange={() => onToggle(user.id)}
        />
      </div>
    </div>
  );
};

export default UserCard;
