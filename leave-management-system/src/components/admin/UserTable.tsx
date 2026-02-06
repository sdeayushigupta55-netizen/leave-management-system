import type { User } from "../../type/user";
import { useUsers } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import Table, { type Column } from "../../ui/Table";
import { userStatusColorMap } from "../../utils/statusConfig";
import StatusBadge from "../../ui/StatusBadge";
import ToggleUserButton from "../../ui/Toggle";
import { Edit } from "lucide-react";
import { rankToKey, roleToKey } from "../../utils/translationHelper";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

const UsersTable = ({ users, onEdit }: UserTableProps) => {
  const { t } = useTranslation();
  const { toggleUser } = useUsers();

  // Translate rank
  const translateRank = (rank: string | undefined) => {
    if (!rank) return "-";
    const key = rankToKey[rank];
    return key ? t(key) : rank;
  };

  // Translate role
  const translateRole = (role: string) => {
    const key = roleToKey[role];
    return key ? t(key) : role;
  };

  const columns: Column<User>[] = [
    { header: t("name"), accessor: "name" },
    { header: t("role"), accessor: (u) => translateRole(u.role) },
    { header: t("rank"), accessor: (u) => translateRank(u.rank) },
    { header: t("uno"), accessor: "uno" },
    {
      header: t("status"),
      accessor: (u) => (
        <StatusBadge
          status={u.isActive ? "ACTIVE" : "INACTIVE"}
          colorMap={userStatusColorMap}
        />
      ),
    },
    {
      header: t("actions"),
      accessor: (u) => (
        <div className="flex items-center gap-2">
          <Edit
            className="cursor-pointer text-primary-600 hover:text-primary-800"
            size={16}
            onClick={() => onEdit(u)}
          />
          <ToggleUserButton checked={u.isActive} onChange={() => toggleUser(u.id)} />
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={users} />;
};

export default UsersTable;