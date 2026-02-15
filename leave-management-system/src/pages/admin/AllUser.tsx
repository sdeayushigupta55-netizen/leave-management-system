import DashboardLayout from "../../layouts/DashboardLayout";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import UserTable from "../../components/admin/UserTable";
import AddUserModal from "../../components/admin/AddUserModal";
import Button from "../../ui/Button";
import UserCard from "../../components/admin/UserCard";
import { useUsers } from "../../context/UserContext";
import type { User} from "../../type/user";
import { Users } from "lucide-react";



const AllUsers = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { users, toggleUser } = useUsers();
  const [editUser, setEditUser] = useState<User | null>(null);

  const [roleFilter] = useState("ALL");
  const [rankFilter, setRankFilter] = useState("ALL");
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [policeStationFilter, setPoliceStationFilter] = useState("ALL");
  const [circleOfficeFilter, setCircleOfficeFilter] = useState("ALL");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [activeFilter, setActiveFilter] = useState("ALL");

  // Get unique values for dropdowns
  const uniquePoliceStations = Array.from(new Set(users.map(u => u.policeStation).filter(Boolean)));
  const uniqueCircleOffices = Array.from(new Set(users.map(u => u.circleOffice).filter(Boolean)));
  const uniqueAreas = Array.from(new Set(users.map(u => u.area).filter(Boolean)));
  const ranks = ["CONSTABLE", "HEADCONSTABLE", "SI", "INSPECTOR", "SHO/SO", "CO", "SP"];  
  // Exclude SSP from the list since SSP is the admin
  const filteredUsers = users.filter((user) => {
    if (user.rank === "SSP") return false; // SSP is admin, not shown in table
    const roleMatch = roleFilter === "ALL" || user.role === roleFilter;
    const rankMatch = rankFilter === "ALL" || user.rank === rankFilter;
    const areaMatch = areaFilter === "ALL" || user.area === areaFilter;
    const policeStationMatch = policeStationFilter === "ALL" || user.policeStation === policeStationFilter;
    const circleOfficeMatch = circleOfficeFilter === "ALL" || user.circleOffice === circleOfficeFilter;
    const genderMatch = genderFilter === "ALL" || user.gender === genderFilter;
    const activeMatch = activeFilter === "ALL" || (activeFilter === "ACTIVE" ? user.isActive : !user.isActive);
    return (
      roleMatch &&
      rankMatch &&
      areaMatch &&
      policeStationMatch &&
      circleOfficeMatch &&
      genderMatch &&
      activeMatch
    );
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
              {/* Role Filter */}
              {/* <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allRoles")}</option>
                <option value="POLICE">{t("police")}</option>
                <option value="ADMIN">{t("admin")}</option>
              </select> */}
              {/* Rank Filter */}
              <select
                value={rankFilter}
                onChange={(e) => setRankFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allRanks")}</option>
                {ranks.map(rank => (
                  <option key={rank} value={rank}>{rank}</option>
                ))}
              </select>
              {/* Area Filter */}
              <select
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allAreas") || "All Areas"}</option>
                {uniqueAreas.map(area => (
                  <option key={area} value={area}>{area}</option>
                ))}
              </select>
              {/* Police Station Filter */}
              <select
                value={policeStationFilter}
                onChange={(e) => setPoliceStationFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allPoliceStations") || "All Police Stations"}</option>
                {uniquePoliceStations.map(station => (
                  <option key={station} value={station}>{station}</option>
                ))}
              </select>
              {/* Circle Office Filter */}
              <select
                value={circleOfficeFilter}
                onChange={(e) => setCircleOfficeFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allCircleOffices") || "All Circle Offices"}</option>
                {uniqueCircleOffices.map(office => (
                  <option key={office} value={office}>{office}</option>
                ))}
              </select>
              {/* Gender Filter */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allGenders") || "All Genders"}</option>
                <option value="MALE">{t("male") || "Male"}</option>
                <option value="FEMALE">{t("female") || "Female"}</option>
              </select>
              {/* Active/Inactive Filter */}
              <select
                value={activeFilter}
                onChange={(e) => setActiveFilter(e.target.value)}
                className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#1a237e] focus:outline-none transition-colors"
              >
                <option value="ALL">{t("allStatus") || "All Status"}</option>
                <option value="ACTIVE">{t("active") || "Active"}</option>
                <option value="INACTIVE">{t("inactive") || "Inactive"}</option>
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