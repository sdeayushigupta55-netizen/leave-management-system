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
    <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-base">{user.name}</h3>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        <StatusBadge
          status={user.isActive ? "ACTIVE" : "INACTIVE"}
          colorMap={userStatusColorMap}
        />
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 text-xs">Role</p>
          <p className="font-medium">{user.role}</p>
        </div>

        <div>
          <p className="text-gray-500 text-xs">Rank</p>
          <p className="font-medium">{user.rank || "-"}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-2 border-t">
        <button
          onClick={() => onEdit?.(user)}
          className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800"
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
