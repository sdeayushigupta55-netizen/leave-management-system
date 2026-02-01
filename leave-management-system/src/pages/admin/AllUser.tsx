
import DashboardLayout from "../../layouts/DashboardLayout";

import { useState } from "react";

import UserTable from "../../components/admin/UserTable";
import AddUserModal from "../../components/admin/AddUserModal";
import Button from "../../ui/Button";
import UserCard from "../../components/admin/UserCard";
import { useUsers } from "../../context/UserContext";
import type { User } from "../../type/user";

const AdminDashboard = () => {
   
  const [open, setOpen] = useState(false);
  const { users, toggleUser } = useUsers();
  const [editUser, setEditUser] = useState<User | null>(null);
  return (
    <DashboardLayout>
      
      {/* <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1> */}
      <div className="border rounded-lg p-4 sm:p-6 bg-gray-50 min-h-screen ">
       <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">Users</h2>
        <Button
          onClick={() => setOpen(true)}
          variant="primary"
          className="px-4 py-2 bg-primary text-white rounded-md hover:opacity-90"
        >
          + Add User
        </Button>
      </div>

    
        {/* Desktop Table */}
      <div className="hidden md:block">
        <UserTable onEdit={(user) => setEditUser(user)} />
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
         {users.map(user => (
          <UserCard
            key={user.id}
            user={user}
            onToggle={toggleUser}
            onEdit={(u) => console.log("edit", u)}
          />
        ))}
      </div>
      </div>

     {editUser ? (
  <AddUserModal
    user={editUser}
    onClose={() => setEditUser(null)}
  />
) : open ? (
  <AddUserModal onClose={() => setOpen(false)} />
) : null}
    </DashboardLayout>
  );
};

export default AdminDashboard;
