import type { User } from "../../type/user";
import { useUsers } from "../../context/UserContext";
import { useTranslation } from "react-i18next";
import Table, { type Column } from "../../ui/Table";
import { userStatusColorMap } from "../../utils/statusConfig";
import StatusBadge from "../../ui/StatusBadge";
import ToggleUserButton from "../../ui/Toggle";
import { Edit } from "lucide-react";
import { rankToKey, roleToKey } from "../../utils/translationHelper";
import { useState } from "react";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

const UsersTable = ({ users, onEdit }: UserTableProps) => {
  const { t } = useTranslation();
  const { toggleUser } = useUsers();
 const [page, setPage] = useState(1);
  const pageSize = 10; 
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

    { header: t("rank"), accessor: (u) => translateRank(u.rank) },
    { header: t("pno"), accessor: "pno" },
    { header: t("role"), accessor: (u) => translateRole(u.role) },
    { header: t("area"), accessor: (u) => u.area || "-" },
    { header: t("policeStation"), accessor: (u) => u.policeStation || "-" },
    { header: t("circleOffice"), accessor: (u) => u.circleOffice || "-" },
    { header: t("contact"), accessor: (u) => u.contact || "-" },
    { header: t("gender"), accessor: (u) => u.gender || "-" },
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
          <ToggleUserButton checked={u.isActive} onChange={() => toggleUser(u._id ?? "")} />
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={users}  page={page}
      pageSize={pageSize}
      onPageChange={setPage}/>;
};

export default UsersTable;