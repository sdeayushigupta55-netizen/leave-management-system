import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import UserTable from "../../components/admin/UserTable";
import AddUserModal from "../../components/admin/AddUserModal";
import Button from "../../ui/Button";
import UserCard from "../../components/admin/UserCard";
import { useUsers } from "../../context/UserContext";
import type { User } from "../../type/user";

const AllUsers = () => {
  const [open, setOpen] = useState(false);
  const { users, toggleUser } = useUsers();
  const [editUser, setEditUser] = useState<User | null>(null);

  // === FILTER STATE ===
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [rankFilter, setRankFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  // === FILTER LOGIC ===
  const filteredUsers = users.filter(user => {
    const roleMatch = roleFilter === "ALL" || user.role === roleFilter;
    const rankMatch = rankFilter === "ALL" || user.rank === rankFilter;
    const searchMatch =
      search === "" ||
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.policeStation?.toLowerCase().includes(search.toLowerCase());
    return roleMatch && rankMatch && searchMatch;
  });

  return (
    <DashboardLayout>
      <div className="border rounded-lg p-4 sm:p-6 bg-gray-50 min-h-screen ">
         
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        {/* Left side: Heading and Add User button */}
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-xl">Users</h2>
          
        </div>
        {/* Right side: Filters */}
        <div className="flex gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="ALL">All Roles</option>
            <option value="POLICE">Police</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={rankFilter}
            onChange={e => setRankFilter(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="ALL">All Ranks</option>
            <option value="CONSTABLE">Constable</option>
            <option value="HEAD_CONSTABLE">Head Constable</option>
            <option value="SI">SI</option>
            <option value="INSPECTOR">Inspector</option>
            <option value="SHO">SHO</option>
          </select>
          {/* Uncomment if you want the search input */}
          {/* <input
            type="text"
            placeholder="Search name/email/station"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border rounded px-2 py-1"
          /> */}
           <Button
            onClick={() => setOpen(true)}
            variant="primary"
            className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
          >
            + Add User
          </Button>
        </div>
       
      </div>

       
        {/* Desktop Table */}
        <div className="hidden md:block">
          <UserTable users={filteredUsers} onEdit={user => setEditUser(user)} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onToggle={toggleUser}
              onEdit={u => setEditUser(u)}
            />
          ))}
        </div>
      </div>

      {editUser ? (
        <AddUserModal user={editUser} onClose={() => setEditUser(null)} />
      ) : open ? (
        <AddUserModal onClose={() => setOpen(false)} />
      ) : null}
    </DashboardLayout>
  );
};

export default AllUsers;