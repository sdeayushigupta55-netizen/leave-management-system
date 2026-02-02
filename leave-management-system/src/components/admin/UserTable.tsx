import type { User } from "../../type/user";
import { useUsers } from "../../context/UserContext";
import Table, { type Column } from "../../ui/Table";
import {userStatusColorMap } from "../../utils/statusConfig";
import StatusBadge from "../../ui/StatusBadge";
import ToggleUserButton from "../../ui/Toggle";
import {Edit} from "lucide-react";

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

const UsersTable = ({ users, onEdit }: UserTableProps) => {
  const { toggleUser } = useUsers();
   

 
  const columns: Column<User>[] = [
    { header: "Name", accessor: "name" },
    { header: "Role", accessor: "role" },
    { header: "Police Rank", accessor: (T) => T.rank || "-" },
    { header: "Email", accessor: "email" },
    { 
  header: "Status", 
  accessor: (T) => (
   <StatusBadge status={T.isActive ? "ACTIVE" : "INACTIVE"} colorMap={userStatusColorMap} />
  )
},
    {
      header: "Actions",
      accessor: (u) => (
        <div className="flex items-center gap-2">
        
    <Edit
        className="cursor-pointer text-primary-600 hover:text-primary-800"
        size={16}
       onClick={() => onEdit(u)}
        
      />
      {/* <Trash className="cursor-pointer text-red-600 hover:text-red-800" size={16}/> */}
       <ToggleUserButton
      checked={u.isActive}
      onChange={() => toggleUser(u.id)}
    /> 
        </div>
        ),
      
    },
  ];

  return <Table columns={columns} data={users} />;
};

export default UsersTable;
