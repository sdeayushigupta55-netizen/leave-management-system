import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserTable from "../../components/admin/UserTable";
import AddUserModal from "../../components/admin/AddUserModal";
import Button from "../../ui/Button";
import UserCard from "../../components/admin/UserCard";
import { useUsers } from "../../context/UserContext";
import type { User } from "../../type/user";
import { Users } from "lucide-react";

const AllUsers = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { users, toggleUser } = useUsers();
  const [editUser, setEditUser] = useState<User | null>(null);

  const [roleFilter, setRoleFilter] = useState("ALL");
  const [rankFilter, setRankFilter] = useState("ALL");

  // Exclude SSP from the list since SSP is the admin
  const filteredUsers = users.filter((user) => {
    if (user.rank === "SSP") return false; // SSP is admin, not shown in table
    const roleMatch = roleFilter === "ALL" || user.role === roleFilter;
    const rankMatch = rankFilter === "ALL" || user.rank === rankFilter;
    return roleMatch && rankMatch;
  });

  return (
    <DashboardLayout>
      <div className="rounded-2xl p-4 sm:p-6 min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#e8eaf6] rounded-xl">
            <Users className="text-[#1a237e]" size={24} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a237e]">{t("users")}</h2>
            <p className="text-sm text-gray-500">{t("manageAllPersonnel")}</p>
          </div>
        </div>

        {/* Filters and Add Button */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div className="flex gap-3 flex-wrap">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allRoles")}</option>
                <option value="POLICE">{t("police")}</option>
                <option value="ADMIN">{t("admin")}</option>
              </select>
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allRanks")}</option>
                <option value="CONSTABLE">{t("constable")}</option>
                <option value="HEAD_CONSTABLE">{t("headConstable")}</option>
                <option value="SI">{t("si")}</option>
                <option value="INSPECTOR">{t("inspector")}</option>
                <option value="SHO/SO">{t("shoSo")}</option>
                <option value="CO">{t("co")}</option>
                <option value="SP">{t("sp")}</option>
              </select>
            </div>
            <Button
              onClick={() => setOpen(true)}
              variant="primary"
            >
              + {t("addUser")}
            </Button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block">
          <UserTable users={filteredUsers} onEdit={(user) => setEditUser(user)} />
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onToggle={toggleUser}
              onEdit={(u) => setEditUser(u)}
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