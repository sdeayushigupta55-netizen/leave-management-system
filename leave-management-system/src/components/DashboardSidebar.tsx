import React from "react";
import { NavLink } from "react-router-dom";
import { PanelLeftOpen, PanelRightOpen } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import type { UserRole } from "../type/user";
import { FaHome, FaCalendarPlus, FaListAlt, FaUserShield, FaUsers } from "react-icons/fa";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

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

  // State for submenu open/close
  const [openSubmenus, setOpenSubmenus] = React.useState<{ [key: string]: boolean }>({});

  const handleSubmenuToggle = (path: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const menuItems: {
    labelKey: string;
    path: string;
    roles: UserRole[];
    ranks?: string[];
    icon?: React.ReactNode;
    submenu?: { labelKey: string; path: string }[];
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
        roles: ["POLICE", "ADMIN"],
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
        roles: ["POLICE", "ADMIN"],
        ranks: ["SHO/SO", "CO", "SP", "SSP"],
        icon: <FaListAlt />,
      },
      {
        labelKey: "Beat book",
        path: "/beat-book",
        roles: ["POLICE"],
        ranks: ["CONSTABLE", "HEADCONSTABLE"],
        icon: <FaListAlt />,
        submenu: [
          { labelKey: "General Details", path: "/beat-book/general-details" },
          { labelKey: "Population Details", path: "/beat-book/population-details" },
          { labelKey: "Important Persons", path: "/beat-book/important-persons" },
          { labelKey: "History Sheeters / Criminals", path: "/beat-book/history-sheeters" },
          { labelKey: "Licensed Arms Holders", path: "/beat-book/licensed-arms-holders" },
          { labelKey: "Sensitive Places", path: "/beat-book/sensitive-places" },
          { labelKey: "Daily Patrolling Register", path: "/beat-book/daily-patrolling-register" },
          { labelKey: "Dispute / Tension Register", path: "/beat-book/dispute-tension-register" },
          { labelKey: "Festivals / Special Events", path: "/beat-book/festivals-special-events" },
          { labelKey: "Special Notes", path: "/beat-book/special-notes" },
        ],
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
        <nav className="mt-4 flex flex-col gap-2 px-4">
          {filteredMenu.map((item) => (
            <div key={item.path}>
              <NavLink
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
                {!collapsed && (
                  <span className="whitespace-nowrap flex items-center">
                    {t(item.labelKey)}
                    {/* Submenu toggle icon inline with label */}
                    {item.submenu && (
                      <button
                        type="button"
                        className="ml-2 focus:outline-none"
                        onClick={e => {
                          e.preventDefault();
                          handleSubmenuToggle(item.path);
                        }}
                        aria-label={openSubmenus[item.path] ? "Close submenu" : "Open submenu"}
                        tabIndex={-1}
                      >
                        {openSubmenus[item.path] ? <FaChevronDown size={16} /> : <FaChevronRight size={16} />}
                      </button>
                    )}
                  </span>
                )}
              </NavLink>
              {/* Render submenu if present and open */}
              {!collapsed && item.submenu && openSubmenus[item.path] && (
                <div className="ml-8 flex flex-col gap-1 pt-2">
                  {item.submenu.map((sub) => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={() => { if (window.innerWidth < 768) setMobileOpen(false); }}
                      className={({ isActive }) =>
                        `flex items-center gap-2 py-2 rounded-lg transition text-sm font-normal px-4
                        ${isActive ? "bg-[#c5a200] text-[#0d1b2a] font-semibold shadow" : "text-gray-200"}`
                      }
                    >
                      <span>{t(sub.labelKey)}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;