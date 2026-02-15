import { NavLink } from "react-router-dom";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import type { UserRole } from "../type/user";
import { FaHome, FaCalendarPlus, FaListAlt, FaUserShield, FaUsers } from "react-icons/fa";

type DashboardSidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const menuItems: {
    labelKey: string;
    path: string;
    roles: UserRole[];
    ranks?: string[];
    icon?: React.ReactNode;
  }[] = [
      {
        labelKey: "dashboard",
        path: "/police",
        roles: ["POLICE"],
        icon: <FaHome />,
      },
     
      {
        labelKey: "applyLeave",
        path: "/police/apply-leave",
        roles: ["POLICE","ADMIN"],
        ranks: ["SHO/SO", "CO", "SP", "INSPECTOR", "SI", "HEADCONSTABLE", "CONSTABLE"],
        icon: <FaCalendarPlus />,
      },
      {
        labelKey: "myLeaveStatus",
        path: "/police/leave-status",
        roles: ["POLICE"],
        ranks: ["SHO/SO", "CO", "SP", "INSPECTOR", "SI", "HEADCONSTABLE", "CONSTABLE"],
        icon: <FaListAlt />,
      },
      {
        labelKey: "seniorDetails",
        path: "/police/senior-details",
        roles: ["POLICE"],
        ranks: ["SHO/SO", "CO", "SP", "INSPECTOR", "SI", "HEADCONSTABLE", "CONSTABLE"],
        icon: <FaUserShield />,
      },
      
      
      
      {
    labelKey: "Dashboard",
    path: "/admin",
    roles: ["ADMIN"],
    ranks: ["SSP"],
    icon: <FaHome />,
  },
  {
    labelKey: "allUsers",
    path: "/admin/all-users",
    roles: ["ADMIN"],
    ranks: ["SSP"],
    icon: <FaUsers />,
  },
  {
  labelKey: "Bns 2023",
  path: "/bns-2023",
  roles: ["POLICE"],
  ranks: ["SHO/SO", "CO", "SP", "INSPECTOR", "SI", "HEADCONSTABLE", "CONSTABLE", "SSP"],
  icon: <FaListAlt />,
},
{
        labelKey: "pendingApprovals",
        path: "/police/pending-leave",
        roles: ["POLICE","ADMIN"],
        ranks: ["SHO/SO", "CO", "SP", "SSP"],
        icon: <FaListAlt />,
      },
{
  labelKey: "Bns 2023",
  path: "/bns-2023",
  roles: ["ADMIN"],
  icon: <FaListAlt />,
},
    ];

  const filteredMenu = menuItems.filter(
    (item) =>
      item.roles.includes(user?.role as UserRole) &&
      (!item.ranks || item.ranks.includes(user?.rank ?? "CONSTABLE"))
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static
          top-0 left-0
          
          bg-[#0d1b2a]
          text-white
          z-50
          transform
          transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${collapsed ? "w-16" : "w-60"}
          flex flex-col
          shadow-lg md:shadow-none
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between p-4 border-b border-[#1a237e]">
          <div className={`flex items-center ${collapsed ? "justify-center w-full" : "gap-2"}`}>
            {/* Collapse/Expand only on desktop */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:block ml-2"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelRightOpen size={22} />
              ) : (
                <PanelLeftOpen size={22} />
              )}
            </button>
            {!collapsed && <img
              src="https://auth.mygov.in/sites/all/themes/mygovauth/logo.png"
              alt="MyGov"
              className="h-50 w-50"
            />}
          </div>

        </div>

        {/* Menu */}
        <nav className="mt-4 flex flex-col gap-2 px-2">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin" || item.path === "/police"} 
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 rounded-lg transition text-base font-medium
  ${collapsed ? "justify-center px-0" : "px-4"}
  ${isActive
                  ? "bg-[#c5a200] text-[#0d1b2a] font-semibold shadow"
                  : "text-gray-200"}`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap">{t(item.labelKey)}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;